import dbConnect from "../../../lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
        return NextResponse.json({
            success: false,
            message: "All fields are required.",
        }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return NextResponse.json({
            success: false,
            message: "Invalid email format.",
        }, { status: 400 });
    }

    try {
        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });

        if (existingUserVerifiedByUsername) {
            return NextResponse.json({
                success: false,
                message: "Username already exists",
            }, { status: 409 });
        }

        const existingUserByEmail = await UserModel.findOne({ email });

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "User already exists with this email",
                }, { status: 400 });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verificationCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verificationCode,
                verifyCodeExpiry: new Date(Date.now() + 3600000),
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(email, username, verificationCode);
        if (!emailResponse.success) {
            return NextResponse.json({
                success: false,
                message: emailResponse.message,
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "User registered successfully. Please check your email for verification.",
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({
            success: false,
            message: "Error registering user.",
        }, { status: 500 });
    }
}