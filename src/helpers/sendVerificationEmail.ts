import {resend} from '@/lib/resend';
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(email: string,username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystry message | Verification Code',
            html: `<p>Hello ${username},</p><p>Your verification code is: <strong>${verifyCode}</strong></p>`,
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        console.log("Resend API Response:", response);
        return {
            success: true,
            message: 'Verification email sent successfully.',
        };
    } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        return {
            success: false,
            message: 'Failed to send verification email.',
        };
    }
}