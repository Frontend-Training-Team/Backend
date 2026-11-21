class CreateAppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const notFound = (req, res, next) => {
  next(new CreateAppError(`Route not found: ${req.originalUrl}`, 404));
};

const globalErrorHandler = (err, req, res, next) => {
  let error = err;
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  // هندلة أخطاء Joi
  if (err.isJoi || (err.name === 'ValidationError' && err.details)) {
    const joiMessage = err.details
      .map((detail) => detail.message)
      .join(', ');
    error = new CreateAppError(joiMessage, 400);
    statusCode = error.statusCode;
    message = error.message;
  }

  // هندلة خطأ Mongoose CastError (مثل invalid ObjectId)
  if (err.name === 'CastError') {
    error = new CreateAppError(`Invalid ${err.path}: ${err.value}`, 400);
    statusCode = error.statusCode;
    message = error.message;
  }

  // هندلة خطأ تكرار الحقول الفريدة في MongoDB / Mongoose
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue || {}).join(', ');
    error = new CreateAppError(`Duplicate value for field: ${duplicateField}`, 409);
    statusCode = error.statusCode;
    message = error.message;
  }

  // هندلة خطأ Mongoose ValidationError
  if (err.name === 'ValidationError' && err.errors) {
    const validationMessage = Object.values(err.errors)
      .map((el) => el.message)
      .join(', ');
    error = new CreateAppError(validationMessage, 400);
    statusCode = error.statusCode;
    message = error.message;
  }

  // هندلة أخطاء JWT
  if (err.name === 'JsonWebTokenError') {
    error = new CreateAppError('Invalid token. Please log in again.', 401);
    statusCode = error.statusCode;
    message = error.message;
  }

  if (err.name === 'TokenExpiredError') {
    error = new CreateAppError('Token has expired. Please log in again.', 401);
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export { CreateAppError, notFound, globalErrorHandler };