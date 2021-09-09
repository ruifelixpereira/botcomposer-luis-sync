
class BError extends Error {
    constructor(error) {
        const message = error instanceof Error ? error.message : error;
        super(message);
    }
}
exports.BError = BError;
