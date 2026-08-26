import { ApiError } from "../utils/ApiError.js"

const validate = (schema, source = "body") => {
    return (req, res, next) => {
        const result = schema.safeParse(req[source])

        if (!result.success) {
            const errors = result.error.errors.map((e) => ({
                field: e.path.join("."),
                message: e.message
            }))
            return next(new ApiError(400, "Validation failed", errors))
        }

        // Replace with the parsed (and possibly transformed) data
        req[source] = result.data
        next()
    }
}

export { validate }