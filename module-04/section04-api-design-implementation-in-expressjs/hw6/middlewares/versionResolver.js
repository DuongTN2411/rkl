const { sendError } = require('../utils/response');

const SUPPORTED_VERSIONS = ['v1', 'v2'];
const SUNSET_DATE = 'Wed, 31 Dec 2025 23:59:59 GMT';

function versionResolver(req, res, next) {
  req.apiVersion = (req.headers['api-version'] || 'v1').trim().toLowerCase();

  if (!SUPPORTED_VERSIONS.includes(req.apiVersion)) {
    return sendError(
      res,
      400,
      'UNSUPPORTED_API_VERSION',
      `Api-Version "${req.apiVersion}" không được hỗ trợ. Các version hợp lệ: ${SUPPORTED_VERSIONS.join(', ')}`
    );
  }

  if (req.apiVersion === 'v1') {
    res.set('Deprecation', 'true');
    res.set('Sunset', SUNSET_DATE);
  }

  next();
}

module.exports = versionResolver;
