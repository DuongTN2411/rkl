const sendSuccess = (res, status, message, data = null, meta) => {
  const body = { success: true, message, data };
  if (meta !== undefined) {
    body.meta = meta;
  }
  return res.status(status).json(body);
};

const sendError = (res, status, message, errors = null) => {
  const body = { success: false, message, data: null };
  if (errors) {
    body.errors = errors;
  }
  return res.status(status).json(body);
};

module.exports = { sendSuccess, sendError };
