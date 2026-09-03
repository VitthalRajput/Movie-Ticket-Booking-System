import {
    createBooking as createBookingService,
} from "../services/booking.service.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// ==========================================
// CREATE BOOKING
// ==========================================

const createBooking = asyncHandler(async (req, res) => {

    const { showtimeId, seatIds } = req.body;

    // userId comes from verified JWT.
    // Never trust userId from req.body.
    const userId = req.user.id;


    const booking = await createBookingService({
        userId,
        showtimeId,
        seatIds,
    });


    return res.status(201).json(
        new ApiResponse(
            201,
            booking,
            "Booking created successfully"
        )
    );
});


export {
    createBooking,
};