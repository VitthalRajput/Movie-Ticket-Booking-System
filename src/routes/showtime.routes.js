import { Router } from "express";

import {
    createShowtime,
    getShowtimes,
    getShowtimeById,
    updateShowtime,
    deleteShowtime,
} from "../controllers/showtime.controller.js";

import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
    createShowtimeSchema,
    updateShowtimeSchema,
} from "../validators/showtime.schema.js";

import {
    uuidParamSchema,
} from "../validators/common.schema.js";


const router = Router();


// ==========================================
// PUBLIC ROUTES
// ==========================================

// GET /api/showtimes
router
    .route("/")
    .get(getShowtimes);


// GET /api/showtimes/:id
router
    .route("/:id")
    .get(
        validate(uuidParamSchema, "params"),
        getShowtimeById
    );


// ==========================================
// ADMIN ROUTES
// ==========================================

// POST /api/showtimes
router
    .route("/")
    .post(
        verifyJWT,
        verifyAdmin,
        validate(createShowtimeSchema),
        createShowtime
    );


// PATCH /api/showtimes/:id
router
    .route("/:id")
    .patch(
        verifyJWT,
        verifyAdmin,
        validate(uuidParamSchema, "params"),
        validate(updateShowtimeSchema),
        updateShowtime
    );


// DELETE /api/showtimes/:id
router
    .route("/:id")
    .delete(
        verifyJWT,
        verifyAdmin,
        validate(uuidParamSchema, "params"),
        deleteShowtime
    );


export default router;