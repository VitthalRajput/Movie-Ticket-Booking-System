import {
    createMovie as createMovieService,
    getMovies as getMoviesService,
    getMovieById as getMovieByIdService,
    updateMovie as updateMovieService,
    deleteMovie as deleteMovieService,
} from "../services/movie.service.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// ==========================================
// CREATE MOVIE
// ==========================================

const createMovie = asyncHandler(async (req, res) => {

    const movie = await createMovieService(req.body);

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

    const movies = await getMoviesService();

    return res.status(200).json(
        new ApiResponse(
            200,
            movies,
            "Movies fetched successfully"
        )
    );
});


// GET MOVIE BY ID

const getMovieById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const movie = await getMovieByIdService(id);

    return res.status(200).json(
        new ApiResponse(
            200,
            movie,
            "Movie fetched successfully"
        )
    );
});



// UPDATE MOVIE

const updateMovie = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const movie = await updateMovieService(
        id,
        req.body
    );

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

    await deleteMovieService(id);

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