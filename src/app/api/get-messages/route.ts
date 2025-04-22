import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Not Authorized",
      }),
      { status: 401 }
    );
  }

  try {
    const userId = new mongoose.Types.ObjectId(user._id);

    // Fetch the user's messages and sort them by createdAt descending
    const userDoc = await UserModel.findById(userId).select("messages");

    if (!userDoc) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
        }),
        { status: 404 }
      );
    }

    const sortedMessages = userDoc.messages
      .slice()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return new Response(
      JSON.stringify({
        success: true,
        messages: sortedMessages,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in /api/get-messages:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal Server Error",
      }),
      { status: 500 }
    );
  }
}
