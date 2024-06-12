import dbConnection from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnection();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }
    const existingUserbyEmail = await UserModel.findOne({ email });
    const verifyCodeOtp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    if (existingUserbyEmail) {
        if (existingUserbyEmail.isVerified) {
          return Response.json(
        {
          success: false,
          message:"User already exist with this email",
        },
        { status: 500 }
      );
        } else {
            const hashedPassword = await bcryptjs.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            existingUserbyEmail.password = hashedPassword;
            existingUserbyEmail.verifyCode = verifyCodeOtp;
            existingUserbyEmail.verifyCodeExpiry = expiryDate;
            await existingUserbyEmail.save();
      }
    } else {
      const hashedPassword = await bcryptjs.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCodeOtp,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }
    //send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCodeOtp
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error Rergistring user", error);
    return Response.json(
      {
        success: false,
        message: "Error registring user",
      },
      {
        status: 500,
      }
    );
  }
}
