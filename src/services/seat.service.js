import { ApiError } from "../utils/ApiError.js";

import {
    findShowtimeById,
    findBySeatDetails,
    create,
    findByShowtimeId,
} from "../repositories/seat.repository.js";


// ==========================================
// CREATE SEAT
// ==========================================

const createSeat = async ({
    showtimeId,
    seatNumber,
    rowLabel,
}) => {

    // Check showtime exists
    const showtime =
        await findShowtimeById(showtimeId);

    if (!showtime) {
        throw new ApiError(
            404,
            "Showtime not found"
        );
    }

    // Check duplicate seat
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
// GET SEATS FOR SHOWTIME
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


export {
    createSeat,
    getSeatsByShowtime,
};