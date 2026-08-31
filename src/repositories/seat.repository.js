import { prisma } from "../config/prisma.js";


// ==========================================
// FIND SHOWTIME
// ==========================================

const findShowtimeById = (showtimeId) => {
    return prisma.showtime.findUnique({
        where: {
            id: showtimeId,
        },
    });
};


// ==========================================
// FIND SEAT
// ==========================================

const findBySeatDetails = ({
    showtimeId,
    seatNumber,
    rowLabel,
}) => {
    return prisma.seat.findFirst({
        where: {
            showtimeId,
            seatNumber,
            rowLabel,
        },
    });
};


// ==========================================
// CREATE SEAT
// ==========================================

const create = (data) => {
    return prisma.seat.create({
        data,
    });
};


// ==========================================
// GET SEATS FOR SHOWTIME
// ==========================================

const findByShowtimeId = (showtimeId) => {
    return prisma.seat.findMany({
        where: {
            showtimeId,
        },
        orderBy: [
            {
                rowLabel: "asc",
            },
            {
                seatNumber: "asc",
            },
        ],
    });
};


export {
    findShowtimeById,
    findBySeatDetails,
    create,
    findByShowtimeId,
};