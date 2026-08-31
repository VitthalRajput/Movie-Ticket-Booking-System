import { z } from "zod";


// CREATE MOVIE SCHEMA

const createMovieSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Movie title is required")
        .max(200, "Movie title is too long"),

    description: z
        .string()
        .trim()
        .max(2000, "Description is too long")
        .optional(),

    durationMin: z
        .number()
        .int("Duration must be an integer")
        .positive("Duration must be greater than 0"),

    posterUrl: z
        .string()
        .url("Invalid poster URL")
        .optional(),
});


// ==========================================
// UPDATE MOVIE SCHEMA
// ==========================================

const updateMovieSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(1, "Movie title cannot be empty")
            .max(200, "Movie title is too long")
            .optional(),

        description: z
            .string()
            .trim()
            .max(2000, "Description is too long")
            .optional(),

        durationMin: z
            .number()
            .int("Duration must be an integer")
            .positive("Duration must be greater than 0")
            .optional(),

        posterUrl: z
            .string()
            .url("Invalid poster URL")
            .optional(),
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field must be provided",
        }
    );


export {
    createMovieSchema,
    updateMovieSchema,
};