import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmails";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Msytry Message | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "verification email send successfully",
    };
  } catch (emailError) {
    console.error("Error sending varification email", emailError);
    return {
      success: false,
      message: "failed to send verification email",
    };
  }
}
