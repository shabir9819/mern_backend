const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      const result = await requestHandler(req, res, next);
      return result; // Ensure the result of the handler is returned
    } catch (err) {
      next(err);
    }
  };
};

export { asyncHandler };
