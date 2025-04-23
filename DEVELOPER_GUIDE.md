# Wizard Generator – Developer Guide

## Overview
`wizard-generator` is a CLI tool for scaffolding files and directories from user-defined templates. It automates repetitive coding tasks by letting developers define, bind, and generate code templates interactively.

---

## Main Features
- **Template Configuration:** Add, remove, or modify code/file templates interactively.
- **Template Binding:** Bind templates with variables and starting directories.
- **File/Folder Generation:** Generate files/folders from templates and user input.
- **CLI Usage:** All operations are performed via the `wizard` command.

---

## Top-Level Control Flow Hierarchy

### 1. CLI Entry (`index.js`)
```
process.argv -> args
├── if !isWizardConfigAvailable():
│     └── wizardSetup() [Initializes wizard.json and templates dir, then exits]
├── else if args.length:
│     └── serviceManager(args) [Handles commands: generate, list, configure, remove, help]
└── else:
      └── mainOperationChoice() [Prompt: configure templates OR generate from template]
          ├── if configure templates:
          │     └── getConfigureChoices() [Prompt: configure new, remove, modify]
          │           └── performConfiguration(choice)
          │                 ├── configure new template: configureNewTemplate() → showNewTemplate() → inquirer.prompt → chooseDir() → askRecursive() → bindNewTemplate()
          │                 ├── remove template: removeTemplate() → listAllConfiguredTemplates() → inquirer.prompt → updateWizardConfig()
          │                 └── modify existing template: listAllConfiguredTemplates() → inquirer.prompt
          └── if generate from template:
                └── getAllConfiguredTemplates() → chooseTemplate() [Prompt] → askConfirmation() [subdir?]
                      └── if yes: chooseDir() → fileFolderGenerator()
                      └── if no: fileFolderGenerator()
```

### 2. CLI Command Flows via `serviceManager(args)`
```
serviceManager(args)
├── case "generate":
│     ├── if args[1] === "-c": [TODO: Combined generation]
│     ├── else if args[1]: generateTemplateByIdentifier(args[1])
│     │        └── getAllConfiguredTemplates() → find template
│     │        └── if found: chooseDir() → fileFolderGenerator()
│     └── else: showUsage()
├── case "list":
│     ├── if args[1] === "-c" or "configured": getAllConfiguredTemplates() [print]
│     └── if args[1] === "new": showNewTemplate() [print]
├── case "configure":
│     └── if args[1] === "-n": configureNewTemplate()
├── case "remove":
│     └── if args[1]: removeTemplate(args[1])
│     └── else: removeTemplate()
└── default: showUsage()
```

---

## Detailed Function Hierarchies

### Template Configuration Flow
```
performConfiguration(choice)
├── if "configure new template":
│     └── configureNewTemplate()
│           └── showNewTemplate()
│           └── inquirer.prompt([template, name, dir])
│           └── if confirmStartingDir: chooseDir()
│           └── askRecursive() [for variables]
│           └── bindNewTemplate()
│                 └── getWizardConfigObject() → updateWizardConfig()
├── if "remove template":
│     └── removeTemplate()
│           └── listAllConfiguredTemplates()
│           └── inquirer.prompt([templateName])
│           └── getWizardConfigObject() → updateWizardConfig()
└── if "modify existing template":
      └── listAllConfiguredTemplates()
      └── inquirer.prompt([templateName])
```

### Template Generation Flow
```
fileFolderGenerator(templateObj)
├── inquirer.prompt([vars])
├── getWizardConfigObject()
├── path.join(templatePath, templateLocation)
├── generateDirectoriesAndFile(newTemplatePath, startingDir, templateVariablesValues)
│     └── getFileDirectoryName()
│     └── if directory:
│           └── fs.mkdirSync()
│           └── for each file: generateDirectoriesAndFile(...)
│     └── else (file):
│           └── generateFileContentFromVariables()
│           └── fs.writeFileSync()
```

### Template Selection Flow
```
chooseTemplate(allTemplates)
├── inquirer.prompt([templateName])
└── return templateDetails
```

### Directory Selection Flow
```
chooseDir(currentDir)
├── list subdirectories
├── inquirer.prompt([directory])
└── return selected directory
```

### Variable Collection Flow
```
askRecursive(question, fieldToAsk)
├── inquirer.prompt([answerInput, askAgain])
├── if askAgain: recurse
└── else: return allEnteredAnswers
```

### Configuration File Management
```
getWizardConfigObject()
├── if wizard.json exists: read and return
├── else: error and exit
updateWizardConfig(wizardObj)
├── fs.writeFileSync("wizard.json")
```

---

## All Supported CLI Flows

- `wizard` (no args): interactive menu
- `wizard generate <template>`: generate files from a template
- `wizard generate -c`: [TODO] generate combined templates
- `wizard configure -n`: add new template
- `wizard list -c` or `wizard list configured`: list configured templates
- `wizard list new`: list new templates
- `wizard remove <templateName>`: remove template
- `wizard help`: show usage

---

## File/Folder Structure
- `index.js`: Main entry, CLI logic
- `utils/`: Supporting logic (template handling, prompts, file generation)
- `templates/`: Where user templates are stored
- `wizard.json`: Project config (auto-generated)

---

## Extending/Modifying
- Add prompt logic in `utils/inquirer/`
- Add template logic in `utils/generator.js`
- Update CLI commands in `utils/services/service-manager.js`

---

## For More Info
See `Readme.md` for installation and user-facing documentation.
    - **Generate from template:** Select a template and generate files/folders.

### Main Functions and Their Roles

#### 1. `isWizardConfigAvailable()` (`utils/wizard.js`)
Checks if `wizard.json` exists in the root directory.

#### 2. `wizardSetup()` (`utils/inquirer/wizardSetup.js`)
Prompts the user for initial setup and creates `wizard.json` and the `templates` directory.

#### 3. `mainOperationChoice()` (`utils/inquirer/mainOperationChoice.js`)
Asks the user to choose between configuring templates or generating from templates.

#### 4. `getConfigureChoices()` (`utils/inquirer/getConfigureChoices.js`)
Prompts for template configuration options: add, remove, modify.

#### 5. `performConfiguration()` (`utils/inquirer/performConfiguration.js`)
Handles the logic for configuring, removing, or modifying templates.

#### 6. `configureNewTemplate()` (`utils/inquirer/configureNewTemplate.js`)
Guides the user through adding a new template, binding variables, and starting directory.

#### 7. `bindNewTemplate()` (`utils/templates.js`)
Binds a new template to the configuration and updates `wizard.json`.

#### 8. `showNewTemplate()` (`utils/templates.js`)
Lists templates in the `templates` directory that are not yet configured.

#### 9. `listAllConfiguredTemplates()` / `getAllConfiguredTemplates()` (`utils/templates.js`)
Fetches all templates configured in `wizard.json`.

#### 10. `removeTemplate()` (`utils/inquirer-common/removeTemplate.js`)
Removes a template from configuration interactively and updates `wizard.json`.

#### 11. `chooseTemplate()` (`utils/inquirer-common/chooseTemplate.js`)
Prompts the user to select a template for generation.

#### 12. `askConfirmation()` (`utils/inquirer-common/askConfirmation.js`)
Generic confirmation prompt.

#### 13. `chooseDir()` (`utils/chooseDir.js`)
Lets the user navigate and select a target directory for generated files.

#### 14. `fileFolderGenerator()` (`utils/generator.js`)
Main function to generate files/folders from a template, prompting for variable values.

#### 15. `generateDirectoriesAndFile()` (`utils/generator.js`)
Handles recursive directory/file creation and content replacement using template variables.

#### 16. `generateFileContentFromVariables()` (`utils/generator.js`)
Replaces placeholders in template files with user-provided variable values.

#### 17. `serviceManager()` (`utils/services/service-manager.js`)
Handles CLI commands like `generate`, `remove`, `list`, and delegates actions accordingly.

#### 18. `showUsage()` (`utils/services/showUsage.js`)
Prints CLI usage instructions.

---

## Example CLI Flow
1. Run `wizard` in your project directory.
2. If first run, follow setup prompts.
3. Choose to configure templates or generate from template.
4. When generating, select a template, provide variable values, and choose a target directory.
5. Files/folders are generated with content/structure based on your template and input.

---

## File Structure
- `index.js` – Main entry, CLI logic
- `utils/` – All supporting logic (template handling, prompts, file generation)
- `templates/` – Where user templates are stored
- `wizard.json` – Project-specific config (auto-generated)

---

## Extending/Modifying
- Add new prompt logic in `utils/inquirer/`
- Add new template processing logic in `utils/generator.js`
- Update CLI commands in `utils/services/service-manager.js`

---

## For More Info
See `Readme.md` for installation and user-facing documentation.
