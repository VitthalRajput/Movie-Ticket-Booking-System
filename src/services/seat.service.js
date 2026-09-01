import { ApiError } from "../utils/ApiError.js";

import {
    findShowtimeById,
    findById,
    findBySeatDetails,
    create,
    findByShowtimeId,
    holdSeat as holdSeatRepository,
} from "../repositories/seat.repository.js";

import {
    SEAT_HOLD_DURATION_MINUTES,
} from "../config/constants.js";


// ==========================================
// CREATE SEAT
// ==========================================

const createSeat = async ({
    showtimeId,
    seatNumber,
    rowLabel,
}) => {

    const showtime =
        await findShowtimeById(showtimeId);

    if (!showtime) {
        throw new ApiError(
            404,
            "Showtime not found"
        );
    }

    const existingSeat =
        await findBySeatDetails({
            showtimeId,
            seatNumber,
            rowLabel,
        });

    if (existingSeat) {
        throw new ApiError(
            409,
            "Seat already exists for this showtime"
        );
    }

    return create({
        showtimeId,
        seatNumber,
        rowLabel,
    });
};


// ==========================================
// GET SEATS BY SHOWTIME
// ==========================================

const getSeatsByShowtime = async (showtimeId) => {

    const showtime =
        await findShowtimeById(showtimeId);

    if (!showtime) {
        throw new ApiError(
            404,
            "Showtime not found"
        );
    }

    return findByShowtimeId(showtimeId);
};


// ==========================================
// HOLD SEAT
// ==========================================

const holdSeat = async ({
    seatId,
    userId,
}) => {

    // --------------------------------------
    // 1. Get current seat
    // --------------------------------------

    const seat = await findById(seatId);

    if (!seat) {
        throw new ApiError(
            404,
            "Seat not found"
        );
    }


    // --------------------------------------
    // 2. Check whether current hold is valid
    // --------------------------------------

    const now = new Date();

    const isCurrentlyHeld =
        seat.status === "held" &&
        seat.holdExpiresAt &&
        seat.holdExpiresAt > now;


    // --------------------------------------
    // 3. Prevent stealing another user's hold
    // --------------------------------------

    if (isCurrentlyHeld) {

        if (seat.heldBy === userId) {
            throw new ApiError(
                409,
                "You already hold this seat"
            );
        }

        throw new ApiError(
            409,
            "Seat is currently held"
        );
    }


    // --------------------------------------
    // 4. Calculate expiration
    // --------------------------------------

    const holdExpiresAt = new Date(
        now.getTime() +
        SEAT_HOLD_DURATION_MINUTES * 60 * 1000
    );


    // --------------------------------------
    // 5. Atomic acquisition
    // --------------------------------------

    const result = await holdSeatRepository({
        seatId,
        userId,
        expectedVersion: seat.version,
        holdExpiresAt,
    });


    // --------------------------------------
    // 6. Detect race condition
    // --------------------------------------

    if (result.count === 0) {

        throw new ApiError(
            409,
            "Seat is no longer available"
        );
    }


    // --------------------------------------
    // 7. Return updated seat
    // --------------------------------------

    return findById(seatId);
};


export {
    createSeat,
    getSeatsByShowtime,
    holdSeat,
};