export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  if (error?.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: error.message });
  }
  if (error?.code === 11000) {
    return res.status(409).json({ success: false, message: 'SKU already exists.' });
  }
  if (error?.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid product ID.' });
  }
  const status = error.statusCode || 500;
  if (status >= 500) console.error(error);
  return res.status(status).json({
    success: false,
    message: status >= 500 ? 'Internal server error.' : error.message,
  });
}
