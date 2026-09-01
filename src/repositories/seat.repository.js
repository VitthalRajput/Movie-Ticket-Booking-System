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

const findById = (seatId) => {
    return prisma.seat.findUnique({
        where: {
            id: seatId,
        },
    });
};


// ==========================================
// FIND SEAT BY DETAILS
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
// GET SEATS BY SHOWTIME
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


// ==========================================
// HOLD SEAT
// ==========================================

const holdSeat = async ({
    seatId,
    userId,
    expectedVersion,
    holdExpiresAt,
}) => {

    const result = await prisma.seat.updateMany({
        where: {
            id: seatId,

            version: expectedVersion,

            OR: [
                {
                    status: "available",
                },
                {
                    status: "held",
                    holdExpiresAt: {
                        lt: new Date(),
                    },
                },
            ],
        },

        data: {
            status: "held",
            heldBy: userId,
            holdExpiresAt,
            version: {
                increment: 1,
            },
        },
    });

    return result;
};


export {
    findShowtimeById,
    findById,
    findBySeatDetails,
    create,
    findByShowtimeId,
    holdSeat,
};