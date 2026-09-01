import { Router } from "express";

import {
    holdSeat,
    releaseSeatHold,
} from "../controllers/seat.controller.js";

import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
    seatIdParamSchema,
} from "../validators/seat.schema.js";


const router = Router();


// ==========================================
// HOLD SEAT
// ==========================================

// POST /api/seats/:seatId/hold

router
    .route("/:seatId/hold")
    .post(
        verifyJWT,

        validate(
            seatIdParamSchema,
            "params"
        ),

        holdSeat
    );


// ==========================================
// RELEASE SEAT HOLD
// ==========================================

// DELETE /api/seats/:seatId/hold

router
    .route("/:seatId/hold")
    .delete(
        verifyJWT,

        validate(
            seatIdParamSchema,
            "params"
        ),

        releaseSeatHold
    );


export default router;