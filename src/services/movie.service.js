import { ApiError } from "../utils/ApiError.js";

import {
    create,
    findAll,
    findById,
    update,
    remove,
} from "../repositories/movie.repository.js";


// ==========================================
// CREATE MOVIE
// ==========================================

const createMovie = async ({
    title,
    description,
    durationMin,
    posterUrl,
}) => {

    const movie = await create({
        title,
        description,
        durationMin,
        posterUrl,
    });

    return movie;
};


// ==========================================
// GET ALL MOVIES
// ==========================================

const getMovies = async () => {

    const movies = await findAll();

    return movies;
};


// GET MOVIE BY ID

const getMovieById = async (id) => {

    const movie = await findById(id);

    if (!movie) {
        throw new ApiError(
            404,
            "Movie not found"
        );
    }

    return movie;
};


// ==========================================
// UPDATE MOVIE
// ==========================================

const updateMovie = async (
    id,
    {
        title,
        description,
        durationMin,
        posterUrl,
    }
) => {

    const existingMovie = await findById(id);

    if (!existingMovie) {
        throw new ApiError(
            404,
            "Movie not found"
        );
    }

    const movie = await update(
        id,
        {
            ...(title !== undefined && {
                title,
            }),

            ...(description !== undefined && {
                description,
            }),

            ...(durationMin !== undefined && {
                durationMin,
            }),

            ...(posterUrl !== undefined && {
                posterUrl,
            }),
        }
    );

    return movie;
};


// ==========================================
// DELETE MOVIE
// ==========================================

const deleteMovie = async (id) => {

    const existingMovie = await findById(id);

    if (!existingMovie) {
        throw new ApiError(
            404,
            "Movie not found"
        );
    }

    await remove(id);

    return null;
};


export {
    createMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
};