const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      error.statusCode = 400;
      error.isJoi = true;
      return next(error);
    }
    req.body = value;
    next();
  };
};

export default validate;