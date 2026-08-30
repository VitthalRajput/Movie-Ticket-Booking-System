import { Router } from "express";
import {
    createMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
} from "../controllers/movie.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

const router = Router();

// Public — anyone can browse movies
router.route("/").get(getMovies);
router.route("/:id").get(getMovieById);

// Admin-only — movie management
router.route("/").post(verifyJWT, verifyAdmin, createMovie);
router.route("/:id")
    .patch(verifyJWT, verifyAdmin, updateMovie)
    .delete(verifyJWT, verifyAdmin, deleteMovie);

export default router;