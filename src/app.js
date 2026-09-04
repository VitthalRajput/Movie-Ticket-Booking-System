import express from "express";

// ==========================================
// ROUTES
// ==========================================

import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import showtimeRoutes from "./routes/showtime.routes.js";
import seatRoutes from "./routes/seat.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

// ==========================================
// MIDDLEWARE
// ==========================================

import { errorHandler } from "./middlewares/errorHandler.middleware.js";


const app = express();


// ==========================================
// GLOBAL MIDDLEWARES
// ==========================================

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded form data
app.use(
    express.urlencoded({
        extended: true,
    })
);


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/health", (req, res) => {

    return res.status(200).json({
        success: true,
        message: "SeatLock API is running",
    });

});


// ==========================================
// API ROUTES
// ==========================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/movies",
    movieRoutes
);

app.use(
    "/api/showtimes",
    showtimeRoutes
);

// Seat routes contain two route groups:
//
// GET/POST /api/showtimes/:showtimeId/seats
// POST/DELETE /api/seats/:seatId/hold

app.use(
    "/api/showtimes",
    seatRoutes
);

app.use(
    "/api/seats",
    seatRoutes
);

// Booking routes
//
// POST /api/bookings

app.use(
    "/api/bookings",
    bookingRoutes
);


// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {

    return res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });

});


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

// IMPORTANT:
// This must be AFTER all routes and the 404 handler.

app.use(errorHandler);


export default app;