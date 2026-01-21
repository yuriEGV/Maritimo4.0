function errorMiddleware(err, req, res, next) {
    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';

    // Ensure CORS headers are present even on errors
    const origin = req.headers.origin;
    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    return res.status(status).json({ message });
}

export default errorMiddleware;


