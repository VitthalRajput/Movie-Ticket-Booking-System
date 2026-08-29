import { ApiError } from "../utils/ApiError.js"

const verifyAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        throw new ApiError(403, "Admin access required")
    }
    next()
}

export { verifyAdmin }