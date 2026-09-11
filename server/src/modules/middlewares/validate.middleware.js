const ApiResponse = require('../utils/apiResponse');

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params
  });

  if (!result.success) {
    const formatted = result.error.errors.map(err => ({
      path: err.path.slice(1).join('.'),
      message: err.message
    }));
    return ApiResponse.error(res, 'Validation Failed', 400, formatted);
  }

  req.validated = result.data;
  next();
};

module.exports = validate;