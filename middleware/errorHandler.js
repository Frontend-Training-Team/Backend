class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // هندلة أخطاء Joi
  if (err.isJoi || (err.name === 'ValidationError' && err.details)) {
    statusCode = 400;
    message = err.details.map((detail) => detail.message).join(', ');
  }

  // هندلة خطأ Mongoose CastError (مثل Invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // هندلة خطأ تكرار الحقول الفريدة في MongoDB / Mongoose
  if (err.code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys(err.keyValue || {}).join(', ');
    message = `Duplicate value for field: ${duplicateField}`;
  }

  // هندلة خطأ Mongoose ValidationError
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((el) => el.message)
      .join(', ');
  }

  // هندلة أخطاء JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired. Please log in again.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export { AppError, globalErrorHandler };