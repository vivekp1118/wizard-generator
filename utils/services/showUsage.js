/**
 * CLI usage display utility
 * Shows help information for Wizard Generator CLI commands
 * @module showUsage
 */

import { logger } from "../common/logger.js";

/**
 * ANSI color codes for output formatting
 * @type {Object}
 */
const COLORS = {
  green: "\x1b[32m",
  reset: "\x1b[0m"
};

/**
 * CLI command descriptions
 * @type {Object}
 */
const COMMANDS = [
  { cmd: "wizard help", desc: "Show usage information" },
  { cmd: "wizard generate <template>", desc: "Generate files from the specified template" },
  { cmd: "wizard generate -c", desc: "Generate multiple templates combined" },
  { cmd: "wizard configure -n", desc: "Configure a new template" },
  { cmd: "wizard list -c", desc: "List all configured templates" },
  { cmd: "wizard list configured", desc: "List all configured templates (alternative)" },
  { cmd: "wizard list new", desc: "List new templates (not yet configured)" },
  { cmd: "wizard remove <t-code>", desc: "Remove a template using its code" },
  { cmd: "wizard remove <templateName>", desc: "Remove a template using its name" }
];

/**
 * Displays usage instructions for the CLI
 * Shows available commands and their descriptions
 * 
 * @returns {void}
 */
export function showUsage() {
  let usageText = "\n    Usage:\n\n";
  
  // Format each command with proper padding
  const padLength = 60; // Padding to align descriptions
  COMMANDS.forEach(({ cmd, desc }) => {
    const paddedCmd = cmd.padEnd(padLength);
    usageText += `    ${paddedCmd}${desc}\n`;
  });
  
  // Output using the logger with color formatting
  console.log(
    COLORS.green + usageText + COLORS.reset
  );
}
