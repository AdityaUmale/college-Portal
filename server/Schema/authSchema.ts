import * as z from 'zod'

const loginSchema = z.object({
    email: z.string().email({
        message: "Invalid email address"
    }),
    password: z.string().max(20, {
        message: "Password shouldnt be that long ?",
      }),
})


const registerSchema = z.object({
    name: z.string().max(20, {
        message: "Name shouldnt be that long"
    }),
    email: z.string().email({
        message: "Invalid email address"
    }),
    password: z.string()  
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/\d/, { message: "Password must contain at least one digit" })
    .regex(/[!@#$%^&*()_+\-=\[\]{}|;':",.<>?/]/, { message: "Password must contain at least one special character"
   }),
})


export { loginSchema, registerSchema }