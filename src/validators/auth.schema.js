import { z } from "zod";



// REGISTER SCHEMA


const registerSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(72, "Password must not exceed 72 characters"),
});


// LOGIN SCHEMA


const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(1, "Password is required"),
});


export {
    registerSchema,
    loginSchema,
};