const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const { name } = err.keyValue;

  const message = `Duplicate field value: "${name}",Please use another value!`;

  return new AppError(message, 404);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in again.', 401);
};

const sendErrorDev = (err, req, res) => {
  // Api
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // Render website
  return res.status(err.statusCode).render('error', {
    title: 'Some thing went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // API
  // Operational, trusted error: send message to client
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      // programming or other unknown error: dont leak error details
    }
    // 1) Log error
    console.error('Error 💥', err);
    // 2) send generic message
    return res.status(500).json({
      status: 'error',
      message: 'something went wrong!',
    });
  }
  // render web
  if (err.isOperational) {
    console.log(er.message);
    return res.status(err.statusCode).render('error', {
      title: 'Some thing went wrong!',
      msg: err.message,
    });
    // programming or other unknown error: dont leak error details
  }
  // 1) Log error
  console.error('Error 💥', err);
  // 2) send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Some thing went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, name: err.name };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTError();

    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    // console.log(err.message);
    // console.log(error.message);
    sendErrorProd(error, req, res);
  }
};
