import { Router } from "express";

import {
    createBooking,
} from "../controllers/booking.controller.js";

import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import {
    createBookingSchema,
} from "../validators/booking.schema.js";


const router = Router();


// ==========================================
// CREATE BOOKING
// ==========================================

// POST /api/bookings

router
    .route("/")
    .post(
        verifyJWT,

        validate(
            createBookingSchema,
            "body"
        ),

        createBooking
    );


export default router;