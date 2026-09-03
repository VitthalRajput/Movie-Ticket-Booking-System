import { ApiError } from "../utils/ApiError.js";

import {
    findShowtimeById,
    findSeatsByIds,
    createBookingTransaction,
    findById,
} from "../repositories/booking.repository.js";


// ==========================================
// BOOKING CONFIGURATION
// ==========================================

// Temporary server-side seat price.
// Later this can come from a proper pricing model.
const SEAT_PRICE = 200;


// ==========================================
// CREATE BOOKING
// ==========================================

const createBooking = async ({
    userId,
    showtimeId,
    seatIds,
}) => {

    // --------------------------------------
    // 1. Check showtime
    // --------------------------------------

    const showtime =
        await findShowtimeById(showtimeId);

    if (!showtime) {
        throw new ApiError(
            404,
            "Showtime not found"
        );
    }


    // --------------------------------------
    // 2. Fetch requested seats
    // --------------------------------------

    const seats =
        await findSeatsByIds(seatIds);


    // --------------------------------------
    // 3. Make sure all requested seats exist
    // --------------------------------------

    if (seats.length !== seatIds.length) {
        throw new ApiError(
            404,
            "One or more seats not found"
        );
    }


    // --------------------------------------
    // 4. Validate every seat
    // --------------------------------------

    const now = new Date();

    for (const seat of seats) {

        // ----------------------------------
        // Seat must belong to this showtime
        // ----------------------------------

        if (seat.showtimeId !== showtimeId) {
            throw new ApiError(
                400,
                `Seat ${seat.seatNumber} does not belong to this showtime`
            );
        }


        // ----------------------------------
        // Seat must currently be held
        // ----------------------------------

        if (seat.status !== "held") {
            throw new ApiError(
                409,
                `Seat ${seat.rowLabel}${seat.seatNumber} is not held`
            );
        }


        // ----------------------------------
        // Seat must be held by this user
        // ----------------------------------

        if (seat.heldBy !== userId) {
            throw new ApiError(
                409,
                `Seat ${seat.rowLabel}${seat.seatNumber} is held by another user`
            );
        }


        // ----------------------------------
        // Hold must not be expired
        // ----------------------------------

        if (
            !seat.holdExpiresAt ||
            seat.holdExpiresAt <= now
        ) {
            throw new ApiError(
                409,
                `Hold expired for seat ${seat.rowLabel}${seat.seatNumber}`
            );
        }
    }


    // --------------------------------------
    // 5. Calculate trusted amount
    // --------------------------------------

    const totalAmount =
        seatIds.length * SEAT_PRICE;


    // --------------------------------------
    // 6. Create booking atomically
    // --------------------------------------

    const result =
        await createBookingTransaction({
            userId,
            showtimeId,
            seatIds,
            totalAmount,
        });


    // --------------------------------------
    // 7. Return complete booking
    // --------------------------------------

    return findById(result.booking.id);
};


export {
    createBooking,
};