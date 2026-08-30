import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import { errorHandler } from "./middlewares/errorHandler.middleware.js"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())

// Routes
import authRouter from "./routes/auth.routes.js"
import movieRouter from "./routes/movie.routes.js"

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/movies", movieRouter)

// Centralized error handler — must be LAST
app.use(errorHandler)

export { app }