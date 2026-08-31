import {
    createShowtime as createShowtimeService,
    getShowtimes as getShowtimesService,
    getShowtimeById as getShowtimeByIdService,
    updateShowtime as updateShowtimeService,
    deleteShowtime as deleteShowtimeService,
} from "../services/showtime.service.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// ==========================================
// CREATE SHOWTIME
// ==========================================

const createShowtime = asyncHandler(async (req, res) => {

    const showtime =
        await createShowtimeService(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            showtime,
            "Showtime created successfully"
        )
    );
});


// ==========================================
// GET ALL SHOWTIMES
// ==========================================

const getShowtimes = asyncHandler(async (req, res) => {

    const showtimes =
        await getShowtimesService();

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

    const showtime =
        await getShowtimeByIdService(id);

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

    const showtime =
        await updateShowtimeService(
            id,
            req.body
        );

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

    await deleteShowtimeService(id);

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






/* Request
  ↓
showtime.routes.js
  ↓
verifyJWT
  ↓
verifyAdmin
  ↓
validate(createShowtimeSchema)
  ↓
Controller
  ↓
createShowtimeService(req.body)
  ↓
Service
  ↓
findMovieById()
  ↓
Repository
  ↓
Prisma
  ↓
PostgreSQL
  ↓
Movie found
  ↓
findConflictingShowtime()
  ↓
Repository
  ↓
Prisma
  ↓
PostgreSQL
  ↓
No conflict
  ↓
create()
  ↓
Repository
  ↓
Prisma
  ↓
PostgreSQL
  ↓
Created Showtime
  ↓
Service
  ↓
Controller
  ↓
ApiResponse
  ↓
201 Created
*/