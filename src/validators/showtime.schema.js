import { z } from "zod";


// CREATE SHOWTIME SCHEMA

const createShowtimeSchema = z.object({
    movieId: z
        .string()
        .uuid("Invalid movie ID"),

    theatre: z
        .string()
        .trim()
        .min(1, "Theatre is required")
        .max(200, "Theatre name is too long"),

    screenNumber: z
        .number()
        .int("Screen number must be an integer")
        .positive("Screen number must be greater than 0"),

    showTime: z
        .string()
        .datetime({
            message: "Invalid showtime",
        }),
});


// UPDATE SHOWTIME SCHEMA

const updateShowtimeSchema = z
    .object({
        movieId: z
            .string()
            .uuid("Invalid movie ID")
            .optional(),

        theatre: z
            .string()
            .trim()
            .min(1, "Theatre cannot be empty")
            .max(200, "Theatre name is too long")
            .optional(),

        screenNumber: z
            .number()
            .int("Screen number must be an integer")
            .positive("Screen number must be greater than 0")
            .optional(),

        showTime: z
            .string()
            .datetime({
                message: "Invalid showtime",
            })
            .optional(),
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field must be provided",
        }
    );


export {
    createShowtimeSchema,
    updateShowtimeSchema,
};