import { prisma } from "../config/prisma.js";


// ==========================================
// FIND MOVIE BY ID
// ==========================================

const findMovieById = (movieId) => {
    return prisma.movie.findUnique({
        where: {
            id: movieId,
        },
    });
};


// ==========================================
// FIND CONFLICTING SHOWTIME
// ==========================================

const findConflictingShowtime = ({
    theatre,
    screenNumber,
    showTime,
    excludeId,
}) => {
    return prisma.showtime.findFirst({
        where: {
            theatre,
            screenNumber,
            showTime,

            ...(excludeId && {
                NOT: {
                    id: excludeId,
                },
            }),
        },
    });
};


// ==========================================
// CREATE SHOWTIME
// ==========================================

const create = (data) => {
    return prisma.showtime.create({
        data,
    });
};


// ==========================================
// GET ALL SHOWTIMES
// ==========================================

const findAll = () => {
    return prisma.showtime.findMany({
        orderBy: {
            showTime: "asc",
        },
        include: {
            movie: true,
        },
    });
};


// ==========================================
// GET SHOWTIME BY ID
// ==========================================

const findById = (id) => {
    return prisma.showtime.findUnique({
        where: {
            id,
        },
        include: {
            movie: true,
        },
    });
};


// ==========================================
// UPDATE SHOWTIME
// ==========================================

const update = (id, data) => {
    return prisma.showtime.update({
        where: {
            id,
        },
        data,
    });
};


// ==========================================
// DELETE SHOWTIME
// ==========================================

const remove = (id) => {
    return prisma.showtime.delete({
        where: {
            id,
        },
    });
};


export {
    findMovieById,
    findConflictingShowtime,
    create,
    findAll,
    findById,
    update,
    remove,
};