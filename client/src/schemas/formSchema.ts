"use client";

import { z } from "zod";

export const loginSchema = z.object({
  password: z.string().max(20, {
    message: "Password shouldnt be that long ?",
  }),
  email: z.string().email({
    message: "Input correct email address",
  }),
});

export const signupSchema = z.object({
  name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid Email Address",
  }),
  password: z.string()  
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/\d/, { message: "Password must contain at least one digit" })
  .regex(/[!@#$%^&*()_+\-=\[\]{}|;':",.<>?/]/, { message: "Password must contain at least one special character"
 }),
  repassword: z.string()

});