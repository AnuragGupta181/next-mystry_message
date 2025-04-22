import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ messageid: string }> }
) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: "Not Authorized" },
      { status: 401 }
    );
  }

  // Await the promise to extract the actual ID
  const { messageid } = await params;
  if (!mongoose.Types.ObjectId.isValid(messageid)) {
    return NextResponse.json(
      { success: false, error: "Invalid message ID" },
      { status: 400 }
    );
  }

  try {
    const result = await UserModel.updateOne(
      { _id: session.user._id },
      { $pull: { messages: { _id: messageid } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message deleted" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete Message Error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
