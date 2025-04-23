/**
 * Logger utility for consistent logging across the application
 * Provides an abstraction layer over console methods
 * @module logger
 */

/**
 * Log levels
 * @enum {number}
 */
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

/**
 * Current log level - can be adjusted at runtime
 * @type {number}
 */
let currentLevel = LOG_LEVELS.INFO;

/**
 * ANSI color codes for terminal output
 * @type {Object.<string, string>}
 */
const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m"
};

/**
 * Logger object with methods for different log levels
 */
export const logger = {
  /**
   * Set the current log level
   * @param {number} level - The log level to set
   */
  setLevel: (level) => {
    if (Object.values(LOG_LEVELS).includes(level)) {
      currentLevel = level;
    }
  },

  /**
   * Log an error message
   * @param {string} message - The error message
   */
  error: (message) => {
    if (currentLevel >= LOG_LEVELS.ERROR) {
      console.error(`${COLORS.red}[ERROR]${COLORS.reset} ${message}`);
    }
  },

  /**
   * Log a warning message
   * @param {string} message - The warning message
   */
  warn: (message) => {
    if (currentLevel >= LOG_LEVELS.WARN) {
      console.warn(`${COLORS.yellow}[WARN]${COLORS.reset} ${message}`);
    }
  },

  /**
   * Log an info message
   * @param {string} message - The info message
   */
  info: (message) => {
    if (currentLevel >= LOG_LEVELS.INFO) {
      console.info(`${COLORS.green}[INFO]${COLORS.reset} ${message}`);
    }
  },

  /**
   * Log a debug message
   * @param {string} message - The debug message
   */
  debug: (message) => {
    if (currentLevel >= LOG_LEVELS.DEBUG) {
      console.debug(`${COLORS.blue}[DEBUG]${COLORS.reset} ${message}`);
    }
  },

  /**
   * Log a success message (info level with different formatting)
   * @param {string} message - The success message
   */
  success: (message) => {
    if (currentLevel >= LOG_LEVELS.INFO) {
      console.info(`${COLORS.green}[SUCCESS]${COLORS.reset} ${message}`);
    }
  }
};
