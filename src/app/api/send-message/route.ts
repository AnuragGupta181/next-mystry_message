
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import {Message} from "@/model/User";

export async function POST (req : Request){
    await dbConnect();

    const { username, content } = await req.json()
    
    try {
        const user = await UserModel.findOne ({username});
        if (!user) {
            return new Response(JSON.stringify({
                success: false,
                error: "User not found"
            }), { status: 404 });
        }
        //is user accepting the messages
        if (!user.isAcceptingMessage) {
            return new Response(JSON.stringify({
                success: false,
                acceptingMessages: false,
                error: "User is not accepting messages"
            }), { status: 403 });
        }

        const newMessage = { content , createdAt : new Date() };
        user.messages.push(newMessage as Message);
        await user.save();
        return new Response(JSON.stringify({
            success: true,
            message: "Message sent successfully"
        }), { status: 200 });

    } catch (error) {
        console.error("Error in adding-message route:", error);
        return new Response(JSON.stringify({
            success: false,
             error: "Internal Server Error" 
        }), { status: 500 });   
    }
}
