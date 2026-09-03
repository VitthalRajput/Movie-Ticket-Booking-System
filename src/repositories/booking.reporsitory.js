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
// FIND SEATS FOR BOOKING
// ==========================================

const findSeatsByIds = (seatIds) => {
    return prisma.seat.findMany({
        where: {
            id: {
                in: seatIds,
            },
        },
    });
};


// ==========================================
// CREATE BOOKING TRANSACTION
// ==========================================

const createBookingTransaction = async ({
    userId,
    showtimeId,
    seatIds,
    totalAmount,
}) => {

    return prisma.$transaction(async (tx) => {

        // --------------------------------------
        // 1. Create Booking
        // --------------------------------------

        const booking = await tx.booking.create({
            data: {
                userId,
                showtimeId,
                totalAmount,
                status: "pending",
            },
        });


        // --------------------------------------
        // 2. Create BookingSeat records
        // --------------------------------------

        await tx.bookingSeat.createMany({
            data: seatIds.map((seatId) => ({
                bookingId: booking.id,
                seatId,
            })),
        });


        // --------------------------------------
        // 3. Create Payment
        // --------------------------------------

        const payment = await tx.payment.create({
            data: {
                bookingId: booking.id,
                amount: totalAmount,
                status: "pending",
            },
        });


        // --------------------------------------
        // 4. Return complete result
        // --------------------------------------

        return {
            booking,
            payment,
        };
    });
};


// ==========================================
// FIND BOOKING BY ID
// ==========================================

const findById = (bookingId) => {
    return prisma.booking.findUnique({
        where: {
            id: bookingId,
        },

        include: {
            bookingSeats: {
                include: {
                    seat: true,
                },
            },

            payment: true,
        },
    });
};


export {
    findShowtimeById,
    findSeatsByIds,
    createBookingTransaction,
    findById,
};