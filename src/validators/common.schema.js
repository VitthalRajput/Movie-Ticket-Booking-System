import { z } from "zod";


// ==========================================
// UUID PARAM SCHEMAS
// ==========================================

const uuidParamSchema = z.object({
    id: z
        .string()
        .uuid("Invalid ID"),
});


const showtimeIdParamSchema = z.object({
    showtimeId: z
        .string()
        .uuid("Invalid showtime ID"),
});


export {
    uuidParamSchema,
    showtimeIdParamSchema,
};