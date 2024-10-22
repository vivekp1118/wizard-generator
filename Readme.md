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

```bash
wizard [at any path you want to get started]
```

For CLI options, use the `-h` (or `--help`) argument:

```bash
wizard -h
```

### Getting Started with Wizard

Setting up the wizard in your project is a three-step process:

1. Config generation and template addition
2. Bind new templates for use
3. Use the templates

#### 1. Config

-   Run `wizard` in the project you want to set up Wizard for.
-   It will generate a wizard config for your project and a template directory to keep track of all your templates.
-   Add any code into your templates folder. Note that this code will replace the variables that you want to ask for in the template by wrapping them in `<<YourVariable>>`.

#### 2. Bind Template

-   Run `wizard`
-   Select `configure template` -> `bind new template`
-   Enter the following variables:
    -   **Template name**: What you want to call your template
    -   **Starting path**: The path from where you want to start generating this template
    -   **Variables**: Variables that will be asked during template generation

#### 3. Use Template

To use your recently generated template, follow these steps:

-   Run `wizard`
-   Select `generate from template` -> `select your template`
-   Navigate to the `path` where you start
-   Enter `variables`

Done!

## License

MIT [http://rem.mit-license.org](http://rem.mit-license.org)
