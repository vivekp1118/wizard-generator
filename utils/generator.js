/**
 * Template generation utilities
 * Handles file/folder generation from templates with variable substitution
 * @module generator
 */

import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { getFileDirectoryName } from "./getFileDirectoryName.js";
import { getWizardConfigObject } from "./wizard.js";
import { logger } from "./common/logger.js";

/**
 * Placeholder pattern for template variables
 * @type {RegExp}
 */
const VARIABLE_PATTERN = /<<(.*?)>>/g;

/**
 * Generates file content by replacing variables in template files
 * 
 * @param {string} templateLocation - Path to the template file
 * @param {Object} templateVariables - Object containing variable values
 * @returns {string} The processed file content with variables replaced
 * @throws {Error} If there's an error reading the template file
 */
export function generateFileContentFromVariables(templateLocation, templateVariables) {
  try {
    // Read template file
    const templateFileContent = fs.readFileSync(templateLocation, "utf-8");
    
    // Replace variables in template content
    const newFileContent = templateFileContent.replace(
      VARIABLE_PATTERN, 
      (match, key) => {
        const trimmedKey = key.trim();
        const replacement = templateVariables[trimmedKey];
        
        // If variable is missing, log a warning but continue
        if (replacement === undefined) {
          logger.warn(`Missing variable: ${trimmedKey} in template ${path.basename(templateLocation)}`);
          return "";
        }
        
        return replacement;
      }
    );
    
    return newFileContent;
  } catch (error) {
    logger.error(`Error reading template file at ${templateLocation}: ${error.message}`);
    throw new Error(`Failed to process template file ${templateLocation}: ${error.message}`);
  }
}

/**
 * Recursively generates directories and files from templates
 * 
 * @async
 * @param {string} templatePath - Path to the template
 * @param {string} toBeGeneratedPath - Target path for generation
 * @param {Object} templateVariables - Variables to replace in templates
 * @returns {Promise<void>}
 * @throws {Error} If there's an error during generation
 */
export async function generateDirectoriesAndFile(templatePath, toBeGeneratedPath, templateVariables) {
  try {
    // Get file/directory name, possibly with dynamic parts
    const { fileName, fileExtension } = getFileDirectoryName(templatePath, templateVariables);
    const newFileOrDirName = [fileName, fileExtension].filter(Boolean).join(".");
    
    // Handle directories recursively
    if (fs.lstatSync(templatePath).isDirectory()) {
      // Create target directory
      const newPath = path.join(toBeGeneratedPath, newFileOrDirName);
      fs.mkdirSync(newPath, { recursive: true });
      logger.debug(`Created directory: ${newPath}`);
      
      // Process all files in the directory
      const allFiles = fs.readdirSync(templatePath);
      for (const file of allFiles) {
        const filePath = path.join(templatePath, file);
        await generateDirectoriesAndFile(filePath, newPath, templateVariables);
      }
    } 
    // Handle individual files
    else {
      try {
        // Generate file content
        const newFileData = generateFileContentFromVariables(templatePath, templateVariables);
        const newFilePath = path.join(toBeGeneratedPath, newFileOrDirName);
        
        // Write file to target location
        fs.writeFileSync(newFilePath, newFileData);
        logger.success(`Created file: ${newFilePath}`);
      } catch (error) {
        logger.error(`Failed to generate file ${newFileOrDirName}: ${error.message}`);
        throw error;
      }
    }
  } catch (error) {
    logger.error(`Error generating from template ${templatePath}: ${error.message}`);
    throw new Error(`Generation failed: ${error.message}`);
  }
}

/**
 * Main template generation function
 * Collects variable values and generates files/folders
 * 
 * @async
 * @param {Object} templateObj - Template configuration object
 * @param {string} templateObj.templateLocation - Location of the template
 * @param {string} templateObj.startingDir - Target directory for generation
 * @param {string[]} templateObj.vars - Variables required by the template
 * @returns {Promise<void>}
 * @throws {Error} If generation fails
 */
export async function fileFolderGenerator(templateObj) {
  try {
    const { templateLocation, startingDir, vars } = templateObj;
    
    // Validate required properties
    if (!templateLocation || !startingDir || !Array.isArray(vars)) {
      throw new Error("Invalid template configuration. Missing required properties.");
    }
    
    logger.info("\nEnter values for template variables:\n");
    
    // Create questions for each variable
    const questions = vars.map((key) => ({
      type: "input",
      message: `Enter value for ${key}: `,
      name: key,
      validate: (input) => input.trim() ? true : `Value for ${key} is required`
    }));
    
    // Collect variable values from user
    const templateVariablesValues = await inquirer.prompt(questions);
    
    // Get template path from configuration
    const wizardConfigObject = getWizardConfigObject();
    const { templatePath } = wizardConfigObject;
    const newTemplatePath = path.join(templatePath, templateLocation);
    
    logger.info(`Generating files from template '${templateLocation}' to '${startingDir}'...`);
    
    // Generate files/folders from template
    await generateDirectoriesAndFile(newTemplatePath, startingDir, templateVariablesValues);
    
    logger.success("Generation completed successfully!");
  } catch (error) {
    logger.error(`File/folder generation failed: ${error.message}`);
    throw new Error(`Template generation failed: ${error.message}`);
  }
}
