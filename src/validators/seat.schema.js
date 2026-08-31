import { z } from "zod";


// ==========================================
// CREATE SEAT SCHEMA
// ==========================================

const createSeatSchema = z.object({
    seatNumber: z
        .string()
        .trim()
        .min(1, "Seat number is required")
        .max(10, "Seat number is too long"),

    rowLabel: z
        .string()
        .trim()
        .min(1, "Row label is required")
        .max(5, "Row label is too long"),
});


export {
    createSeatSchema,
};