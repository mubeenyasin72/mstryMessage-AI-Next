//Zod Liabrary is used for the validation
import { z } from "zod";

//This is for the Username Validation
export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 character")
  .max(20, "Username must be no more then 20 character")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");



export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Passowrd must be at least 6 character" })
    
})