import { Router } from "express";

import {
    createSeat,
    getSeatsByShowtime,
    holdSeat,
} from "../controllers/seat.controller.js";

import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
    createSeatSchema,
    seatIdParamSchema,
} from "../validators/seat.schema.js";

import {
    showtimeIdParamSchema,
} from "../validators/common.schema.js";


const router = Router();


// ==========================================
// GET SEATS
// ==========================================

// GET /api/showtimes/:showtimeId/seats

router
    .route("/:showtimeId/seats")
    .get(
        validate(
            showtimeIdParamSchema,
            "params"
        ),
        getSeatsByShowtime
    );


// ==========================================
// CREATE SEAT
// ==========================================

// POST /api/showtimes/:showtimeId/seats

router
    .route("/:showtimeId/seats")
    .post(
        verifyJWT,
        verifyAdmin,

        validate(
            showtimeIdParamSchema,
            "params"
        ),

        validate(
            createSeatSchema,
            "body"
        ),

        createSeat
    );


// ==========================================
// HOLD SEAT
// ==========================================

// POST /api/seats/:seatId/hold

router
    .post(
        "/seats/:seatId/hold",

        verifyJWT,

        validate(
            seatIdParamSchema,
            "params"
        ),

        holdSeat
    );


export default router;