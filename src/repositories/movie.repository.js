import { prisma } from "../config/prisma.js";


// CREATE MOVIE

const create = (data) => {
    return prisma.movie.create({
        data,
    });
};


// ==========================================
// GET ALL MOVIES
// ==========================================

const findAll = () => {
    return prisma.movie.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};


// ==========================================
// GET MOVIE BY ID
// ==========================================

const findById = (id) => {
    return prisma.movie.findUnique({
        where: {
            id,
        },
    });
};


// ==========================================
// UPDATE MOVIE
// ==========================================

const update = (id, data) => {
    return prisma.movie.update({
        where: {
            id,
        },
        data,
    });
};


// ==========================================
// DELETE MOVIE
// ==========================================

const remove = (id) => {
    return prisma.movie.delete({
        where: {
            id,
        },
    });
};


export {
    create,
    findAll,
    findById,
    update,
    remove,
};