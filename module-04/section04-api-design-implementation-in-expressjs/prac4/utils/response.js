function sendSuccess(res, status, data, meta) {
  const body = { success: true, data };
  if (meta !== undefined) {
    body.meta = meta;
  }
  return res.status(status).json(body);
}

module.exports = { sendSuccess };
