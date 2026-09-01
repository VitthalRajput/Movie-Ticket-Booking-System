import { z } from "zod";


// ==========================================
// CREATE SEAT
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


// ==========================================
// SEAT ID PARAM
// ==========================================

const seatIdParamSchema = z.object({
    seatId: z
        .string()
        .uuid("Invalid seat ID"),
});


export {
    createSeatSchema,
    seatIdParamSchema,
};


// We don't need a holdSeatSchema because there is currently no body for:

// POST /api/seats/:seatId/hold ----- POST request 