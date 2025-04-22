import {User, getServerSession} from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options" ;
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req:Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session ||  !session.user){
        return new Response(JSON.stringify({
            success: false, 
            message: "Not Authonticated" 
        }), { status: 401 });
    }

    const userId = user._id;
    const {acceptMessages} = await req.json()

    try {
        const upadetedUser = await UserModel.findByIdAndUpdate(
            userId, {acceptMessages: acceptMessages}, { new: true }
        );
        if (!upadetedUser) {
            return new Response(JSON.stringify({
                success: false, 
                message: "Failed to update user status to accept messages" 
            }), { status: 500 });
        }
        return new Response(JSON.stringify({
            success: true, 
            message: "User status updated successfully",upadetedUser 
        }), { status: 200 });

    } catch (error) {
        console.error("Failed to update user status to accept messages : ", error);
        return new Response(JSON.stringify({
            success: false, 
            message: "Failed to update user status to accept messages " 
        }), { status: 500 });
    }
}


export async function GET (req:Request) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;
    
        if (!session ||  !session.user){
            return new Response(JSON.stringify({
                success: false, 
                message: "Not Authonticated" 
            }), { status: 401 });
        }
    
        const userId = user._id;
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return new Response(JSON.stringify({
                success: false, 
                message: "User not found" 
            }), { status: 404 });
        }
    
        return Response.json({
            success: true,
            message: "User found",
            isAcceptingMessages: foundUser.isAcceptingMessage
        }, { status: 200 });

    } catch (error) {
        console.error("Error is getting message acceptance status: ", error);
        return new Response(JSON.stringify({
            success: false, 
            message: "Error is getting message acceptance status" 
        }), { status: 500 });   
    }
}