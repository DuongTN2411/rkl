function sendSuccess(res, status, data, meta) {
  const body = { success: true, data };
  if (meta !== undefined) {
    body.meta = meta;
  }
  return res.status(status).json(body);
}

function sendError(res, status, code, message) {
  return res.status(status).json({
    success: false,
    error: { code, message, status },
  });
}

module.exports = { sendSuccess, sendError };
