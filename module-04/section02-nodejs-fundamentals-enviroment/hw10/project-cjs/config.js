require('dotenv').config();

const config = {
  PROCESSING_DELAY_MS: Number(process.env.PROCESSING_DELAY_MS),
  LOG_TIMEZONE: process.env.LOG_TIMEZONE,
};

module.exports = config;
