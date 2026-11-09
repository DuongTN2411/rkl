const fs = require('fs');
const path = require('path');
const { UPLOAD_DIR } = require('../config/upload');

const removeUploadedFile = (fileName) => {
  if (!fileName) {
    return;
  }

  const safeName = path.basename(fileName);
  fs.unlink(path.join(UPLOAD_DIR, safeName), () => {});
};

module.exports = { removeUploadedFile };
