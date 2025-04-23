/**
 * Service Manager - Implements the Command Pattern for CLI operations
 * Routes CLI commands to appropriate handlers
 * @module service-manager
 */

import { configureNewTemplate } from "../inquirer/configureNewTemplate.js";
import { generateTemplateByIdentifier } from "../getSelectedTemplate.js";
import { getAllConfiguredTemplates, showNewTemplate } from "../templates.js";
import { showUsage } from "./showUsage.js";
import { removeTemplate } from "../inquirer-common/removeTemplate.js";
import { logger } from "../common/logger.js";

// Command definitions
const commands = {
  /**
   * Generates files from a template
   * 
   * @async
   * @param {string[]} args - Command arguments
   * @returns {Promise<void>}
   */
  generate: async (args) => {
    // Check for combined template generation flag
    if (args[1] === "-c") {
      logger.info("Generating templates combined...");
      // TODO: Implement combined template generation
      logger.warn("Combined template generation is not yet implemented");
      return;
    } 
    
    // Generate from a single template
    if (args[1]) {
      try {
        await generateTemplateByIdentifier(args[1]);
        logger.success(`Successfully generated from template: ${args[1]}`);
      } catch (error) {
        logger.error(`Error generating template: ${error.message}`);
        throw error;
      }
    } else {
      logger.error("Template name required for generate command");
      showUsage();
      throw new Error("Missing template name");
    }
  },

  /**
   * Lists templates (configured or new)
   * 
   * @async
   * @param {string[]} args - Command arguments
   * @returns {Promise<void>}
   */
  list: async (args) => {
    const subCommand = args[1];
    
    // List configured templates
    if (subCommand === "-c" || subCommand === "configured") {
      try {
        const allTemplates = getAllConfiguredTemplates();
        if (allTemplates.length > 0) {
          const templateNames = allTemplates.map(t => t.templateName).join('\n - ');
          logger.info(`\nConfigured templates:\n - ${templateNames}\n`);
        } else {
          logger.info("\nNo configured templates found 😔\n");
        }
      } catch (error) {
        logger.error(`Error retrieving configured templates: ${error.message}`);
        throw error;
      }
    } 
    // List new (unconfigured) templates
    else if (subCommand === "new") {
      try {
        const newTemplates = await showNewTemplate();
        if (newTemplates.length > 0) {
          const templateList = newTemplates.join('\n - ');
          logger.info(`\nNew templates:\n - ${templateList}\n`);
        } else {
          logger.info("\nNo new templates found 😔\n");
        }
      } catch (error) {
        logger.error(`Error retrieving new templates: ${error.message}`);
        throw error;
      }
    }
    // Invalid subcommand
    else {
      logger.warn(`Unknown list subcommand: ${subCommand}`);
      showUsage();
    }
  },

  /**
   * Configures a new template
   * 
   * @async
   * @param {string[]} args - Command arguments
   * @returns {Promise<void>}
   */
  configure: async (args) => {
    if (args[1] === "-n") {
      try {
        await configureNewTemplate();
        logger.success("Template configured successfully");
      } catch (error) {
        logger.error(`Error configuring new template: ${error.message}`);
        throw error;
      }
    } else {
      logger.warn("Use -n flag to configure a new template");
      showUsage();
    }
  },

  /**
   * Removes a template
   * 
   * @async
   * @param {string[]} args - Command arguments
   * @returns {Promise<void>}
   */
  remove: async (args) => {
    try {
      if (args[1]) {
        await removeTemplate(args[1]);
        logger.success(`Template '${args[1]}' removed successfully`);
      } else {
        await removeTemplate();
        logger.success("Template removed successfully");
      }
    } catch (error) {
      logger.error(`Error removing template: ${error.message}`);
      throw error;
    }
  },

  /**
   * Shows usage information
   * 
   * @async
   * @returns {Promise<void>}
   */
  help: async () => {
    showUsage();
  }
};

/**
 * Main service manager that routes CLI commands to handlers
 * 
 * @async
 * @param {string[]} args - Command-line arguments
 * @returns {Promise<void>}
 */
export async function serviceManager(args) {
  try {
    const commandName = args[0];
    
    // Check if command exists
    if (commands[commandName]) {
      await commands[commandName](args);
    } else {
      logger.error(`Unknown command: ${commandName}`);
      commands.help();
    }
  } catch (error) {
    logger.error(`Command failed: ${error.message}`);
    // We don't re-throw here since this is a top-level handler
  }
}
