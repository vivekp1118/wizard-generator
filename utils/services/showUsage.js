const green = "\x1b[32m";
const reset = "\x1b[0m";

export function showUsage() {
    console.log(
        green +
            `
    Usage:

    wizard help                                             To show usage
    wizard generate <template>                              Generate a service with the given name
    wizard configure -n                                     Configure a new template
    wizard list -c                                          List all configured templates
    wizard list configured                                  List all configured templates (alternative)
    wizard remove <t-code>                                  Remove a template with the given template code (alternative)
    wizard remove <templateName>                            Remove a template with the given name
    wizard list new                                         List new templates (alternative)
    wizard generate -c                                      Generate multiple templates combined
    ` +
            reset
    );
}
