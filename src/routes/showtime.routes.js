import { Router } from "express";

import {
    createShowtime,
    getShowtimes,
    getShowtimeById,
    updateShowtime,
    deleteShowtime,
} from "../controllers/showtime.controller.js";

import {
    createSeat,
    getSeatsByShowtime,
} from "../controllers/seat.controller.js";

import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import {
    createShowtimeSchema,
    updateShowtimeSchema,
} from "../validators/showtime.schema.js";

import {
    uuidParamSchema,
    showtimeIdParamSchema,
} from "../validators/common.schema.js";

import {
    createSeatSchema,
} from "../validators/seat.schema.js";


const router = Router();


// ==========================================
// PUBLIC SHOWTIME ROUTES
// ==========================================

// GET /api/showtimes

router
    .route("/")
    .get(getShowtimes);


// GET /api/showtimes/:id

router
    .route("/:id")
    .get(
        validate(
            uuidParamSchema,
            "params"
        ),

        getShowtimeById
    );


// ==========================================
// ADMIN SHOWTIME ROUTES
// ==========================================

// POST /api/showtimes

router
    .route("/")
    .post(
        verifyJWT,

        verifyAdmin,

        validate(
            createShowtimeSchema,
            "body"
        ),

        createShowtime
    );


// PATCH /api/showtimes/:id

router
    .route("/:id")
    .patch(
        verifyJWT,

        verifyAdmin,

        validate(
            uuidParamSchema,
            "params"
        ),

        validate(
            updateShowtimeSchema,
            "body"
        ),

        updateShowtime
    );


// DELETE /api/showtimes/:id

router
    .route("/:id")
    .delete(
        verifyJWT,

        verifyAdmin,

        validate(
            uuidParamSchema,
            "params"
        ),

        deleteShowtime
    );


// ==========================================
// SEATS UNDER SHOWTIME
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


export default router;