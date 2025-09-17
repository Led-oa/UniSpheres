/**
 * Classe d'erreur personnalisée pour l'API
 */
class ApiError extends Error {
    constructor(message, statusCode = 500, details = null) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.details = details;

        // Capture la stack trace (utile pour le débogage)
        Error.captureStackTrace(this, this.constructor);
    }
}

// Erreurs métier communes (facultatif mais recommandé)
ApiError.notFound = (message = 'Resource not found') => {
    return new ApiError(message, 404);
};

ApiError.badRequest = (message = 'Bad request', details = null) => {
    return new ApiError(message, 400, details);
};

ApiError.unauthorized = (message = 'Unauthorized') => {
    return new ApiError(message, 401);
};

ApiError.forbidden = (message = 'Forbidden') => {
    return new ApiError(message, 403);
};

ApiError.conflict = (message = 'Conflict', details = null) => {
    return new ApiError(message, 409, details);
};

module.exports = ApiError;