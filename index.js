#!/usr/bin/env node

/**
 * Wizard Generator - CLI tool for scaffolding files using templates
 * Entry point that handles command-line interface and routes to appropriate handlers
 * @module wizard-generator
 */

import { isWizardConfigAvailable } from "./utils/wizard.js";
import { getAllConfiguredTemplates } from "./utils/templates.js";
import { chooseDir } from "./utils/chooseDir.js";
import { fileFolderGenerator } from "./utils/generator.js";
import { wizardSetup } from "./utils/inquirer/wizardSetup.js";
import { mainOperationChoice } from "./utils/inquirer/mainOperationChoice.js";
import { performConfiguration } from "./utils/inquirer/performConfiguration.js";
import { getConfigureChoices } from "./utils/inquirer/getConfigureChoices.js";
import { chooseTemplate } from "./utils/inquirer-common/chooseTemplate.js";
import { askConfirmation } from "./utils/inquirer-common/askConfirmation.js";
import { serviceManager } from "./utils/services/service-manager.js";
import { logger } from "./utils/common/logger.js";

// Constants for operation types to avoid string literals
const OPERATIONS = {
  CONFIGURE: "configure templates",
  GENERATE: "generate from template"
};

/**
 * Handles template generation workflow
 * 
 * @async
 * @param {void}
 * @returns {Promise<void>}
 */
async function handleTemplateGeneration() {
  try {
    const allTemplates = getAllConfiguredTemplates();
    const selectedTemplateDetails = await chooseTemplate(allTemplates);
    logger.info(`Selected template: ${selectedTemplateDetails.templateName}`);

    const promptMessage = 
      `Do you want to choose sub-directory (Press Enter for Y) '${selectedTemplateDetails.startingDir}'`;
    
    const chooseSubDirectory = await askConfirmation(promptMessage);

    // Update starting directory if user wants to choose a different one
    if (chooseSubDirectory) {
      selectedTemplateDetails.startingDir = await chooseDir(selectedTemplateDetails.startingDir);
    }
    
    // Generate files based on the template
    await fileFolderGenerator(selectedTemplateDetails);
    
  } catch (error) {
    logger.error(`Failed to generate from template: ${error.message}`);
  }
}

/**
 * Handles template configuration workflow
 * 
 * @async
 * @param {void}
 * @returns {Promise<void>}
 */
async function handleTemplateConfiguration() {
  try {
    const configureTemplateChoice = await getConfigureChoices();
    await performConfiguration(configureTemplateChoice);
  } catch (error) {
    logger.error(`Failed to configure template: ${error.message}`);
  }
}

/**
 * Main application entry point
 * 
 * @async
 * @param {void}
 * @returns {Promise<void>}
 */
async function main() {
  try {
    const args = process.argv.slice(2);

    // Check for wizard configuration
    if (!isWizardConfigAvailable()) {
      return await wizardSetup();
    }
    
    // If arguments are provided, use the command-line service manager
    if (args.length) {
      return await serviceManager(args);
    }
    
    // Interactive mode when no arguments provided
    logger.info("Welcome to Wizard Generator");
    const operationChoice = await mainOperationChoice();
    
    // Route to appropriate handler based on operation choice
    if (operationChoice === OPERATIONS.CONFIGURE) {
      await handleTemplateConfiguration();
    } else if (operationChoice === OPERATIONS.GENERATE) {
      await handleTemplateGeneration();
    }
    
  } catch (error) {
    logger.error(`An unexpected error occurred: ${error.message}`);
    process.exit(1);
  }
}

// Start the application
main().catch(error => {
  logger.error(`Fatal error: ${error.message}`);
  process.exit(1);
});

