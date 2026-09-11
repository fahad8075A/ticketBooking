class ApiResponse {
  /**
   * Send a successful JSON response
   */
  static success(res, { statusCode = 200, message = 'Success', data = null, meta = {} } = {}) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(Object.keys(meta).length > 0 && { meta }),
    });
  }

  /**
   * Send an error JSON response
   */
  static error(res, { statusCode = 500, message = 'Internal Server Error', errors = null } = {}) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors }),
    });
  }
}

// Export both default and named exports so either import style works
export { ApiResponse, ApiResponse as apiResponse };
export default ApiResponse;