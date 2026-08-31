import { ApiError } from "../utils/ApiError.js";

import {
    findMovieById,
    findConflictingShowtime,
    create,
    findAll,
    findById,
    update,
    remove,
} from "../repositories/showtime.repository.js";


// ==========================================
// CREATE SHOWTIME
// ==========================================

const createShowtime = async ({
    movieId,
    theatre,
    screenNumber,
    showTime,
}) => {

    // Check whether movie exists
    const movie = await findMovieById(movieId);

    if (!movie) {
        throw new ApiError(
            404,
            "Movie not found"
        );
    }

    // Check for theatre + screen + time conflict
    const existingShowtime =
        await findConflictingShowtime({
            theatre,
            screenNumber,
            showTime: new Date(showTime),
        });

    if (existingShowtime) {
        throw new ApiError(
            409,
            "A showtime already exists for this screen at this time"
        );
    }

    return create({
        movieId,
        theatre,
        screenNumber,
        showTime: new Date(showTime),
    });
};


// ==========================================
// GET ALL SHOWTIMES
// ==========================================

const getShowtimes = async () => {

    return findAll();
};


// ==========================================
// GET SHOWTIME BY ID
// ==========================================

const getShowtimeById = async (id) => {

    const showtime = await findById(id);

    if (!showtime) {
        throw new ApiError(
            404,
            "Showtime not found"
        );
    }

    return showtime;
};


// ==========================================
// UPDATE SHOWTIME
// ==========================================

const updateShowtime = async (
    id,
    {
        movieId,
        theatre,
        screenNumber,
        showTime,
    }
) => {

    // Check whether showtime exists
    const existingShowtime = await findById(id);

    if (!existingShowtime) {
        throw new ApiError(
            404,
            "Showtime not found"
        );
    }

    // If movieId is being changed,
    // verify that the new movie exists
    if (movieId !== undefined) {

        const movie = await findMovieById(movieId);

        if (!movie) {
            throw new ApiError(
                404,
                "Movie not found"
            );
        }
    }

    // Determine final values
    const finalTheatre =
        theatre !== undefined
            ? theatre
            : existingShowtime.theatre;

    const finalScreenNumber =
        screenNumber !== undefined
            ? screenNumber
            : existingShowtime.screenNumber;

    const finalShowTime =
        showTime !== undefined
            ? new Date(showTime)
            : existingShowtime.showTime;

    // Check for conflict
    const conflictingShowtime =
        await findConflictingShowtime({
            theatre: finalTheatre,
            screenNumber: finalScreenNumber,
            showTime: finalShowTime,
            excludeId: id,
        });

    if (conflictingShowtime) {
        throw new ApiError(
            409,
            "A showtime already exists for this screen at this time"
        );
    }

    return update(
        id,
        {
            ...(movieId !== undefined && {
                movieId,
            }),

            ...(theatre !== undefined && {
                theatre,
            }),

            ...(screenNumber !== undefined && {
                screenNumber,
            }),

            ...(showTime !== undefined && {
                showTime: new Date(showTime),
            }),
        }
    );
};


// ==========================================
// DELETE SHOWTIME
// ==========================================

const deleteShowtime = async (id) => {

    const existingShowtime = await findById(id);

    if (!existingShowtime) {
        throw new ApiError(
            404,
            "Showtime not found"
        );
    }

    await remove(id);

    return null;
};


export {
    createShowtime,
    getShowtimes,
    getShowtimeById,
    updateShowtime,
    deleteShowtime,
};