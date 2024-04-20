const AsyncHandler = (requestHandlerFunction) => async (req, res, next) => {
  await Promise.resolve(requestHandlerFunction(req, res, next)).catch((err) =>
    next(err)
  );
};

export { AsyncHandler };
