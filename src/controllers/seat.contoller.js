import {
    createSeat as createSeatService,
    getSeatsByShowtime as getSeatsByShowtimeService,
} from "../services/seat.service.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// ==========================================
// CREATE SEAT
// ==========================================

const createSeat = asyncHandler(async (req, res) => {

    const { showtimeId } = req.params;

    const seat = await createSeatService({
        showtimeId,
        ...req.body,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            seat,
            "Seat created successfully"
        )
    );
});


// ==========================================
// GET SEATS BY SHOWTIME
// ==========================================

const getSeatsByShowtime = asyncHandler(async (req, res) => {

    const { showtimeId } = req.params;

    const seats =
        await getSeatsByShowtimeService(showtimeId);

    return res.status(200).json(
        new ApiResponse(
            200,
            seats,
            "Seats fetched successfully"
        )
    );
});


export {
    createSeat,
    getSeatsByShowtime,
};