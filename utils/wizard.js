/**
 * Wizard configuration utilities - manages wizard.json and configuration operations
 * @module wizard
 */

import fs from "fs";
import path from "path";
import { logger } from "./common/logger.js";

// Configuration file paths
const CONFIG_PATHS = {
  wizardConfig: "wizard.json",
  templatesDir: "templates"
};

/**
 * Retrieves the wizard configuration object from wizard.json
 * 
 * @returns {Object} The wizard configuration object
 * @throws {Error} If the wizard.json file cannot be found or parsed
 */
export function getWizardConfigObject() {
  try {
    const configPath = CONFIG_PATHS.wizardConfig;
    
    if (!fs.existsSync(configPath)) {
      throw new Error(`Configuration file ${configPath} not found`);
    }
    
    const configContent = fs.readFileSync(configPath, "utf-8");
    const wizardConfigObject = JSON.parse(configContent);
    
    return wizardConfigObject;
  } catch (error) {
    logger.error(`Failed to read wizard configuration: ${error.message}`);
    throw new Error(`Could not load wizard configuration: ${error.message}`);
  }
}

/**
 * Generates a template code from a template name
 * Creates an abbreviation from the name and adds a random number
 * 
 * @param {string} templateName - The name of the template
 * @returns {string} A generated code for the template
 */
export function generateTemplateCode(templateName) {
  if (!templateName) {
    return `template${Date.now()}`;
  }
  
  // Create abbreviation from name
  const newTemplateName = templateName
    .toLowerCase()
    .replace(/[-_]/g, " ") // Replace all hyphens and underscores
    .split(" ")
    .filter(Boolean) // Filter out empty segments
    .map(item => item[0] || "")
    .join("");

  // Add random number for uniqueness
  return newTemplateName + Math.floor(Math.random() * 1000);
}

/**
 * Checks if the wizard configuration file exists
 * 
 * @returns {boolean} True if wizard.json exists, false otherwise
 */
export function isWizardConfigAvailable() {
  try {
    const list = fs.readdirSync("./");
    return list.includes(CONFIG_PATHS.wizardConfig);
  } catch (error) {
    logger.error(`Error checking for wizard configuration: ${error.message}`);
    return false;
  }
}

/**
 * Generates a new wizard configuration file
 * 
 * @async
 * @param {boolean} isUsingSrc - Whether the project uses a src directory
 * @returns {Promise<void>}
 * @throws {Error} If there's an error creating the config file or templates directory
 */
export async function generateWizardConfig(isUsingSrc) {
  try {
    // Create config object
    const configObject = {
      path: isUsingSrc ? "./src" : "./",
      templatePath: `./${CONFIG_PATHS.templatesDir}`,
      templates: []
    };
    
    // Write config file
    fs.writeFileSync(
      CONFIG_PATHS.wizardConfig,
      JSON.stringify(configObject, null, 4)
    );
    
    // Create templates directory if it doesn't exist
    const templatesDir = path.resolve(CONFIG_PATHS.templatesDir);
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
    }
    
    logger.success("Wizard configuration created successfully");
  } catch (error) {
    logger.error(`Failed to generate wizard configuration: ${error.message}`);
    throw new Error(`Could not generate wizard configuration: ${error.message}`);
  }
}

/**
 * Updates the wizard configuration file with new settings
 * 
 * @param {Object} wizardObj - The updated wizard configuration object
 * @throws {Error} If there's an error updating the configuration file
 */
export function updateWizardConfig(wizardObj) {
  try {
    fs.writeFileSync(
      CONFIG_PATHS.wizardConfig, 
      JSON.stringify(wizardObj, null, 4)
    );
    logger.debug("Wizard configuration updated");
  } catch (error) {
    logger.error(`Failed to update wizard configuration: ${error.message}`);
    throw new Error(`Could not update wizard configuration: ${error.message}`);
  }
}
