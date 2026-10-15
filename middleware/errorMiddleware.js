const notFound = (req, res, next) => {
    res.status(404).json({
      message: "Route not found"
    });
  };
  
  const errorHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).json({
        message: "Invalid JSON request body"
      });
    }
  
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Duplicate resource"
      });
    }
  
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({
        message: "Invalid request data"
      });
    }
  
    const statusCode = err.status || err.statusCode || 500;
  
    res.status(statusCode).json({
      message: statusCode === 500
        ? "Internal server error"
        : err.message
    });
  };
  
  module.exports = { notFound, errorHandler };
  