/**
 * CLI usage display utility
 * Shows help information for Wizard Generator CLI commands
 * @module showUsage
 */

/**
 * ANSI color codes for output formatting
 * @type {Object}
 */
const COLORS = {
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  bold: "\x1b[1m",
  reset: "\x1b[0m"
};

/**
 * CLI command categories with their commands and descriptions
 * @type {Object}
 */
const COMMAND_CATEGORIES = [
  {
    name: "GENERAL",
    commands: [
      { cmd: "wizard", desc: "Launch interactive mode, providing a menu-driven interface" },
      { cmd: "wizard help", desc: "Show this usage information" }
    ]
  },
  {
    name: "TEMPLATE MANAGEMENT",
    commands: [
      { cmd: "wizard configure -n", desc: "Configure a new template through an interactive prompt" },
      { cmd: "wizard list -c", desc: "List all configured templates with their identifiers" },
      { cmd: "wizard list configured", desc: "List all configured templates (alternative)" },
      { cmd: "wizard list new", desc: "List templates in template directory that haven't been configured yet" },
      { cmd: "wizard remove <template-id>", desc: "Remove a specific template by its identifier" },
      { cmd: "wizard remove", desc: "Remove a template through an interactive selection prompt" }
    ]
  },
  {
    name: "FILE GENERATION",
    commands: [
      { cmd: "wizard generate <template-id>", desc: "Generate files from the specified template" },
      { cmd: "wizard generate -c", desc: "Generate files from multiple templates combined (coming soon)" }
    ]
  }
];

/**
 * Examples of common usage scenarios
 * @type {Array}
 */
const EXAMPLES = [
  { cmd: "wizard configure -n", desc: "Follow the prompts to set up a new React component template" },
  { cmd: "wizard generate react-component", desc: "Generate files using the react-component template" },
  { cmd: "wizard list -c", desc: "See what templates are available on your system" },
  { cmd: "wizard", desc: "Use the interactive mode for guided usage" }
];

/**
 * Displays usage instructions for the CLI
 * Shows available commands and their descriptions
 * 
 * @returns {void}
 */
export function showUsage() {
  // Format the title and introduction
  let usageText = `\n${COLORS.bold}${COLORS.green}WIZARD GENERATOR - CLI USAGE GUIDE${COLORS.reset}\n\n`;
  usageText += "Wizard Generator is a tool for scaffolding files and directories from custom templates.\n";
  usageText += "It helps eliminate repetitive file creation tasks in your development workflow.\n\n";
  
  // Format each category of commands
  COMMAND_CATEGORIES.forEach(category => {
    // Add category title
    usageText += `${COLORS.bold}${COLORS.yellow}${category.name}:${COLORS.reset}\n\n`;
    
    // Format each command with proper padding
    const padLength = 35; // Padding to align descriptions
    category.commands.forEach(({ cmd, desc }) => {
      const paddedCmd = cmd.padEnd(padLength);
      usageText += `  ${COLORS.cyan}${paddedCmd}${COLORS.reset} ${desc}\n`;
    });
    
    usageText += "\n";
  });
  
  // Add examples section
  usageText += `${COLORS.bold}${COLORS.yellow}EXAMPLES:${COLORS.reset}\n\n`;
  EXAMPLES.forEach(({ cmd, desc }) => {
    usageText += `  ${COLORS.blue}$ ${cmd}${COLORS.reset}\n    ${desc}\n\n`;
  });
  
  // Add footer note
  usageText += `${COLORS.green}For more information, visit the documentation at: https://github.com/vivekp1118/wizard-generator${COLORS.reset}\n`;
  
  // Output using the console directly for color formatting
  console.log(usageText);
}
