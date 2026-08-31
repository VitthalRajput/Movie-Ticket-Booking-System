import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";




// CREATE SHOWTIME


const createShowtime = asyncHandler(async (req, res) => {
    const {
        movieId,
        theatre,
        screenNumber,
        showTime,
    } = req.body;

    // Check whether the movie exists
    const movie = await prisma.movie.findUnique({
        where: {
            id: movieId,
        },
    });

    if (!movie) {
        throw new ApiError(
            404,
            "Movie not found"
        );
    }

    // Check whether the same screen already has
    // a showtime at the exact same time
    const existingShowtime = await prisma.showtime.findFirst({
        where: {
            theatre,
            screenNumber,
            showTime: new Date(showTime),
        },
    });

    if (existingShowtime) {
        throw new ApiError(
            409,
            "A showtime already exists for this screen at this time"
        );
    }

    const showtime = await prisma.showtime.create({
        data: {
            movieId,
            theatre,
            screenNumber,
            showTime: new Date(showTime),
        },
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            showtime,
            "Showtime created successfully"
        )
    );
});



// GET ALL SHOWTIMES

const getShowtimes = asyncHandler(async (req, res) => {
    const showtimes = await prisma.showtime.findMany({
        orderBy: {
            showTime: "asc",
        },
        include: {
            movie: true,
        },
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            showtimes,
            "Showtimes fetched successfully"
        )
    );
});


// ==========================================
// GET SHOWTIME BY ID
// ==========================================

const getShowtimeById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const showtime = await prisma.showtime.findUnique({
        where: {
            id,
        },
        include: {
            movie: true,
        },
    });

    if (!showtime) {
        throw new ApiError(
            404,
            "Showtime not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            showtime,
            "Showtime fetched successfully"
        )
    );
});


// ==========================================
// UPDATE SHOWTIME
// ==========================================

const updateShowtime = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const {
        movieId,
        theatre,
        screenNumber,
        showTime,
    } = req.body;

    // Check whether showtime exists
    const existingShowtime = await prisma.showtime.findUnique({
        where: {
            id,
        },
    });

    if (!existingShowtime) {
        throw new ApiError(
            404,
            "Showtime not found"
        );
    }

    // If movieId is being changed,
    // verify that the new movie exists
    if (movieId !== undefined) {
        const movie = await prisma.movie.findUnique({
            where: {
                id: movieId,
            },
        });

        if (!movie) {
            throw new ApiError(
                404,
                "Movie not found"
            );
        }
    }

    const updatedTheatre =
        theatre !== undefined
            ? theatre
            : existingShowtime.theatre;

    const updatedScreenNumber =
        screenNumber !== undefined
            ? screenNumber
            : existingShowtime.screenNumber;

    const updatedShowTime =
        showTime !== undefined
            ? new Date(showTime)
            : existingShowtime.showTime;

    // Check for screen/time conflict
    const conflictingShowtime =
        await prisma.showtime.findFirst({
            where: {
                theatre: updatedTheatre,
                screenNumber: updatedScreenNumber,
                showTime: updatedShowTime,

                // Don't compare the showtime with itself
                NOT: {
                    id,
                },
            },
        });

    if (conflictingShowtime) {
        throw new ApiError(
            409,
            "A showtime already exists for this screen at this time"
        );
    }

    const showtime = await prisma.showtime.update({
        where: {
            id,
        },
        data: {
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
        },
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            showtime,
            "Showtime updated successfully"
        )
    );
});


// ==========================================
// DELETE SHOWTIME
// ==========================================

const deleteShowtime = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const showtime = await prisma.showtime.findUnique({
        where: {
            id,
        },
    });

    if (!showtime) {
        throw new ApiError(
            404,
            "Showtime not found"
        );
    }

    await prisma.showtime.delete({
        where: {
            id,
        },
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Showtime deleted successfully"
        )
    );
});


export {
    createShowtime,
    getShowtimes,
    getShowtimeById,
    updateShowtime,
    deleteShowtime,
};