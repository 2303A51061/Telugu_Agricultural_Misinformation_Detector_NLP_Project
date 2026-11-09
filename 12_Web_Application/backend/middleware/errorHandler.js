function errorHandler(err, req, res, next) {
  console.error('[API Error]', err);
  const status = err.statusCode || 500;
  const message = err.message || 'An internal server error occurred.';

  res.status(status).json({
    success: false,
    error: message
  });
}

module.exports = errorHandler;
