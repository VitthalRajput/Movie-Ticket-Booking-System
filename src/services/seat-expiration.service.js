// this repository performs database cleanup
// The service gives us a clean application-level operation:
import {
    releaseExpiredSeatHolds,
} from "../repositories/seat.repository.js";


// ==========================================
// RELEASE EXPIRED SEAT HOLDS
// ==========================================

const cleanupExpiredSeatHolds = async () => {

    const result =
        await releaseExpiredSeatHolds();

    return result.count;
};


export {
    cleanupExpiredSeatHolds,
};