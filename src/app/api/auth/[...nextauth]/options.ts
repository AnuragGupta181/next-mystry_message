// src/app/api/auth/[...nextauth]/options.ts

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { randomUUID } from "crypto";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined");
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        try {
          await dbConnect();

          const { identifier, password } = credentials ?? {};
          if (!identifier || !password) throw new Error("Missing credentials");

          const user = await UserModel.findOne({
            $or: [{ email: identifier }, { username: identifier }],
          });

          if (!user) throw new Error("User not found");
          if (!user.isVerified) throw new Error("User not verified");
          if (!user.password) throw new Error("Password not set");

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) throw new Error("Invalid password");

          return user;
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error("Failed to authorize user");
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      try {
        await dbConnect();

        if (account?.provider === "google" && profile?.email) {
          const email = profile.email;
          const name = profile.name ?? email.split("@")[0];

          let existingUser = await UserModel.findOne({ email });

          if (!existingUser) {
            // Unique username generator
            const baseUsername = name.replace(/\s+/g, "").toLowerCase();
            let finalUsername = baseUsername;
            let counter = 1;
            while (await UserModel.findOne({ username: finalUsername })) {
              finalUsername = `${baseUsername}${counter++}`;
            }
          
            existingUser = await UserModel.create({
              email,
              username: finalUsername,
              provider: "google", // ✅ mark user as Google signup
              isVerified: true,
              isAcceptingMessage: true,
              verifyCode: randomUUID(), // could also be optional or "" for Google
              verifyCodeExpiry: new Date(Date.now() + 3600000), // same here
              password: undefined, // ✅ explicitly avoid setting password
            });
          }          

          token._id = String(existingUser._id);
          token.email = existingUser.email;
          token.username = existingUser.username;
          token.isVerified = existingUser.isVerified;
          token.isAcceptingMessages = existingUser.isAcceptingMessage;
        }

        if (user && !token._id) {
          token._id = user._id?.toString();
          token.email = user.email;
          token.username = user.username;
          token.isVerified = user.isVerified;
          token.isAcceptingMessages = user.isAcceptingMessages;
        }

        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        return token;
      }
    },

    async session({ session, token }) {
      session.user = {
        _id: token._id as string,
        email: token.email as string,
        username: token.username as string,
        isVerified: token.isVerified as boolean,
        isAcceptingMessages: token.isAcceptingMessages as boolean,
      };
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
