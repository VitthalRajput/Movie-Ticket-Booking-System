import { Router } from "express";

import {
    createMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
} from "../controllers/movies.controller.js";

import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
    createMovieSchema,
    updateMovieSchema,
} from "../validators/movie.schema.js";

import {
    uuidParamSchema,
} from "../validators/common.schema.js";


const router = Router();


// ==========================================
// PUBLIC ROUTES
// ==========================================

router
    .route("/")
    .get(getMovies);


router
    .route("/:id")
    .get(
        validate(uuidParamSchema, "params"),
        getMovieById
    );


// ==========================================
// ADMIN ROUTES
// ==========================================

router
    .route("/")
    .post(
        verifyJWT,
        verifyAdmin,
        validate(createMovieSchema),
        createMovie
    );


router
    .route("/:id")
    .patch(
        verifyJWT,
        verifyAdmin,
        validate(uuidParamSchema, "params"),
        validate(updateMovieSchema),
        updateMovie
    );


router
    .route("/:id")
    .delete(
        verifyJWT,
        verifyAdmin,
        validate(uuidParamSchema, "params"),
        deleteMovie
    );


export default router;