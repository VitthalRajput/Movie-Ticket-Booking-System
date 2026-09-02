import {
    cleanupExpiredSeatHolds,
} from "../services/seat-expiration.service.js";

import { logger } from "../utils/logger.js";


// ==========================================
// CONFIGURATION
// ==========================================

const CLEANUP_INTERVAL_MS = 30 * 1000;


// ==========================================
// CLEANUP FUNCTION
// ==========================================

const runSeatHoldCleanup = async () => {

    try {

        const releasedCount =
            await cleanupExpiredSeatHolds();

        if (releasedCount > 0) {

            logger.info({
                releasedCount,
                message: "Expired seat holds released",
            });
        }

    } catch (error) {

        logger.error({
            message: "Seat hold cleanup failed",
            error: error.message,
            stack: error.stack,
        });
    }
};


// ==========================================
// START WORKER
// ==========================================

const startSeatHoldExpirationWorker = () => {

    // Run once immediately
    runSeatHoldCleanup();

    // Then run periodically
    setInterval(
        runSeatHoldCleanup,
        CLEANUP_INTERVAL_MS
    );
};


export {
    startSeatHoldExpirationWorker,
};