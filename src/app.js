import express from "express";

import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import showtimeRoutes from "./routes/showtime.routes.js";
import seatRoutes from "./routes/seat.routes.js";


const app = express();


// ==========================================
// GLOBAL MIDDLEWARES
// ==========================================

app.use(express.json());

app.use(express.urlencoded({
    extended: true,
}));


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

app.use(
    "/api/showtimes",
    seatRoutes
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


export default app;