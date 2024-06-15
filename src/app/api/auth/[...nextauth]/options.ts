import { NextAuthOptions } from "next-auth";
import CreadentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnection from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CreadentialsProvider({
      id: "credentials",
      name: "Creadentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnection();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.password },
            ],
          });
          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account first before login");
          }
          //bcrypt
            // const hashPassword = await bcrypt.compare(credentials.password)
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
};
