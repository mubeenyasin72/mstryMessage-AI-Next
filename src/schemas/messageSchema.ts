import { z } from "zod";

export const acceptMessageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content must be at least of 10 character" })
    .max(300, { message: "Content must be no longer of 300 character" }),
});
