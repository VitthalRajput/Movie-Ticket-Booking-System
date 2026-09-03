import { z } from "zod";


// ==========================================
// CREATE BOOKING SCHEMA
// ==========================================

const createBookingSchema = z.object({

    showtimeId: z
        .string()
        .uuid("Invalid showtime ID"),

    seatIds: z
        .array(
            z
                .string()
                .uuid("Invalid seat ID")
        )
        .min(1, "At least one seat is required")
        .max(10, "You can book a maximum of 10 seats"),

})
.refine(
    (data) => new Set(data.seatIds).size === data.seatIds.length, //We don't want the service processing the same seat twice.
    {
        message: "Duplicate seat IDs are not allowed",
        path: ["seatIds"],
    }
);


export {
    createBookingSchema,
};