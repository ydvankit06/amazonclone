export function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  res
    .status(500)
    .json({ message: 'Internal server error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
}

