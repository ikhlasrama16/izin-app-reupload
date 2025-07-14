/* eslint-disable no-unused-vars */
module.exports = (err, req, res, _next) => {
    const status = err.status || 500;
    res.status(status).json({
      status,
      message: err.message || 'Server Error',
      stack:   process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
  };
  