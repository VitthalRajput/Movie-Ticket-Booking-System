import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";


// ==========================================
// CREATE MOVIE
// ==========================================

const createMovie = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        durationMin,
        posterUrl,
    } = req.body;

    const movie = await prisma.movie.create({
        data: {
            title,
            description,
            durationMin,
            posterUrl,
        },
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            movie,
            "Movie created successfully"
        )
    );
});


// ==========================================
// GET ALL MOVIES
// ==========================================

const getMovies = asyncHandler(async (req, res) => {
    const movies = await prisma.movie.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            movies,
            "Movies fetched successfully"
        )
    );
});


// ==========================================
// GET MOVIE BY ID
// ==========================================

const getMovieById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const movie = await prisma.movie.findUnique({
        where: {
            id,
        },
    });

    if (!movie) {
        throw new ApiError(
            404,
            "Movie not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            movie,
            "Movie fetched successfully"
        )
    );
});


// ==========================================
// UPDATE MOVIE
// ==========================================

const updateMovie = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const {
        title,
        description,
        durationMin,
        posterUrl,
    } = req.body;

    const existingMovie = await prisma.movie.findUnique({
        where: {
            id,
        },
    });

    if (!existingMovie) {
        throw new ApiError(
            404,
            "Movie not found"
        );
    }

    const movie = await prisma.movie.update({
        where: {
            id,
        },
        data: {
            ...(title !== undefined && { title }),

            ...(description !== undefined && {
                description,
            }),

            ...(durationMin !== undefined && {
                durationMin,
            }),

            ...(posterUrl !== undefined && {
                posterUrl,
            }),
        },
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            movie,
            "Movie updated successfully"
        )
    );
});


// ==========================================
// DELETE MOVIE
// ==========================================

const deleteMovie = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const existingMovie = await prisma.movie.findUnique({
        where: {
            id,
        },
    });

    if (!existingMovie) {
        throw new ApiError(
            404,
            "Movie not found"
        );
    }

    await prisma.movie.delete({
        where: {
            id,
        },
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Movie deleted successfully"
        )
    );
});


export {
    createMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
};