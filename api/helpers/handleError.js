export const handleError = (statusCode, message) => {
  const error = new Error(message);  // pass message directly
  error.statusCode = statusCode;     // custom field
  return error;                      // return error object
};
