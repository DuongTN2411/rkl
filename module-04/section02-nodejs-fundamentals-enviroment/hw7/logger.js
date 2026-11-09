require('dotenv').config();

const LEVELS = { info: 1, warn: 2, error: 3 };

const minLevel = LEVELS[process.env.LOG_LEVEL] || LEVELS.info;

let initCount = 0;
initCount++;

function log(level, tag, msg) {
  if (LEVELS[level] >= minLevel) {
    console.log(`[${tag}] ${msg}`);
  }
}

function info(msg) {
  log('info', 'INFO', msg);
}

function warn(msg) {
  log('warn', 'WARN', msg);
}

function error(msg) {
  log('error', 'ERROR', msg);
}

module.exports = {
  info,
  warn,
  error,
  get initCount() {
    return initCount;
  },
};
