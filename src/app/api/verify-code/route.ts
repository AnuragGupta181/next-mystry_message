import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST (req: Request) {
    await dbConnect();

    try {
        const {username, code} = await req.json();
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername});

        if (!user) {
            return new Response(JSON.stringify({
                success: false, 
                message: "User not found"
            }), {status: 404})    
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry ?? 0) > new Date(); 
        if (isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return new Response(JSON.stringify({
                success: true, 
                message: "User verified successfully"
            }), {status: 200})    
        } else if (!isCodeValid) {
            return new Response(JSON.stringify({
                success: false, 
                message: "Invalid code"
            }), {status: 400})    
        }
        else if (!isCodeNotExpired) {
            return new Response(JSON.stringify({
                success: false, 
                message: "Code expired"
            }), {status: 400})    
        } else {
            return new Response(JSON.stringify({
                success: false, 
                message: "Verification code issue"
            }), {status: 400})    
        }
    } catch (error) {
        console.error("Error verifying code:", error);
        return new Response(JSON.stringify({
            success: false, 
            error: "Error verifying code"
        }), {status: 500})    
    }
}