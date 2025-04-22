import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod"

import {usernameValidation} from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object ({
    username: usernameValidation
})

export async function GET (req: Request) {
    await dbConnect();

    try {
        const {searchParams} = new URL(req.url);
        const queryParam = { 
            username: searchParams.get("username")
        }
        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log("result of Verify Username :", result)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            console.log("Username Errors: ", usernameErrors)
            return new Response(JSON.stringify({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid query parameter"
            }), {status: 400});
        }
        const {username} = result.data;
        const existingVerifyedUser = await UserModel.findOne({username, isVerified: true});

        if (existingVerifyedUser) {
            return new Response(JSON.stringify({
                success: false, 
                message: "Username already is taken, try another one 😊"
            }), {status: 409})    
        }
        return new Response(JSON.stringify({
            success: true, 
            message: "Username is unique"
        }), {status: 200})    

    } catch (error) {
        console.error("Error checking username:", error);
        return new Response(JSON.stringify({
            success: false, 
            error: "Error checking Username"
        }), {status: 500})    
    }
}