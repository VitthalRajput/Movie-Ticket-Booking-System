import { ApiError } from "../utils/ApiError.js"
import { logger } from "../utils/logger.js"

const errorHandler = (err, req, res, next) => {
    let error = err

    // Translate known Prisma errors into meaningful ApiErrors
    if (error.code === "P2002") {
        // Unique constraint violation (e.g. duplicate email)
        const field = error.meta?.target?.[0] || "field"
        error = new ApiError(409, `${field} already exists`)
    } else if (error.code === "P2025") {
        // Record not found (e.g. update/delete on a missing row)
        error = new ApiError(404, "Record not found")
    } else if (!(error instanceof ApiError)) {
        // Any other unexpected error — don't leak raw internals to the client
        error = new ApiError(500, error.message || "Internal Server Error")
    }

    logger.error({
        statusCode: error.statusCode,
        message: error.message,
        path: req.originalUrl,
        method: req.method,
        stack: process.env.NODE_ENV !== "production" ? error.stack : undefined
    })

    return res.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        errors: error.errors || []
    })
}

export { errorHandler }