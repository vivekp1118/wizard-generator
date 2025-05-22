# wizard-generator

wizard-generator is a CLI-based tool that helps boost your development time by eliminating the repetitive creation of manual files and handling them automatically using predefined templates.

wizard-generator **does not** require _any_ additional changes to your code or development methods. It is a CLI tool that will scaffold your boilerplate on command.

## Installation

To install globally:

```bash
npm install -g wizard-generator
# or using yarn:
yarn global add wizard-generator
```

wizard-generator will be installed globally to your system path.

To install as a development dependency:

```bash
npm install --save-dev wizard-generator
# or using yarn:
yarn add wizard-generator -D
```

With a local installation, wizard-generator will not be available in your system path, and you can't use it directly from the command line.

You can run it anytime by calling `wizard` in your command line.

## Usage

The wizard-generator can be used in two modes: interactive mode and command mode.

### Interactive Mode

Simply run `wizard` in your terminal to enter interactive mode:

```bash
wizard
```

This will guide you through the available options with interactive prompts.

### Command Mode

Use specific commands to perform actions directly:

```bash
wizard <command> [options]
```

### Help Command

To see all available commands and options:

```bash
wizard help
```

## Command Reference

### General Commands

| Command | Description |
|---------|-------------|
| `wizard` | Launch interactive mode |
| `wizard help` | Show usage information |

### Template Management

| Command | Description |
|---------|-------------|
| `wizard configure -n` | Configure a new template through an interactive prompt |
| `wizard list -c` | List all configured templates with their identifiers |
| `wizard list configured` | List all configured templates (alternative) |
| `wizard list new` | List templates in template directory that haven't been configured yet |
| `wizard remove <template-id>` | Remove a specific template by its identifier |
| `wizard remove` | Remove a template through an interactive selection prompt |

### File Generation

| Command | Description |
|---------|-------------|
| `wizard generate <template-id>` | Generate files from the specified template |
| `wizard generate -c` | Generate files from multiple templates combined (coming soon) |

## Usage Examples

1. **Configure a new template**:
   ```bash
   wizard configure -n
   ```
   Follow the prompts to set up a new template.

2. **Generate files using a template**:
   ```bash
   wizard generate react-component
   ```
   This will use the "react-component" template to generate files.

3. **List available templates**:
   ```bash
   wizard list -c
   ```
   Shows all templates that have been configured.

4. **Interactive mode**:
   ```bash
   wizard
   ```
   Launches the wizard in interactive mode for a guided experience.

### Getting Started with Wizard

Setting up the wizard in your project is a three-step process:

1. Config generation and template addition
2. Bind new templates for use
3. Use the templates

#### 1. Config

-   Run `wizard` in the project you want to set up Wizard for.
-   It will generate a wizard config for your project and a `template` directory to keep track of all your templates.

Here is the merged version of the two points, with clearer flow and instructions:

---

#### 2. Create and Bind Templates

1. **Create Template Files**:

    - Add any `code`, `file`, or `folder` that you want to use as a template inside your `templates` folder.
    - Use placeholders for dynamic content:

        - Wrap variables inside `<< >>` (e.g., `<<YourVariable>>`).
        - Wrap file or folder names inside `[[ ]]` (e.g., `[[fileName]]`).

        Example:

        - **`[[serviceName]].controller.js`**:

            ```javascript
            // Controller for the <<serviceName>> service
            const <<serviceName>>Service = require('./<<serviceName>>.service');

            exports.getAll = async (req, res) => {
              try {
                const data = await <<serviceName>>Service.getAll();
                res.json(data);
              } catch (error) {
                res.status(500).send(error.message);
              }
            };
            ```

-   **Register and Bind the Template**:
    -   Run the following command to register the template:
        ```bash
        wizard configure -n
        ```
    -   During the registration process, you'll be prompted to:
        -   **Select the directory** for your template (e.g., `templates/serviceTemplate`).
        -   **Define the variables** used in your template (e.g., `serviceName`, `fileName`).
        -   **Name the template** (e.g., `ServiceTemplate`).

#### 3. Use Template

To use your recently generated template, follow these steps:

-   Run `wizard`
-   Select `generate from template` -> `select your template`
-   Navigate to the `path` where you start
-   Enter `variables`

Done!

## License

MIT [http://rem.mit-license.org](http://rem.mit-license.org)
