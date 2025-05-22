# Contributing to Wizard Generator

Thank you for considering contributing to Wizard Generator! This document outlines the coding standards and guidelines we follow to maintain a consistent, high-quality codebase.

## Code Style and Standards

### JavaScript Standards

- **ES Modules**: Use ES module syntax (`import`/`export`) consistently
- **Node.js Compatibility**: Ensure code works with Node.js 14.x and above
- **Async/Await**: Use async/await instead of callbacks or bare Promises

### Function Style

- Use **async function declarations** for top-level functions and async operations:
  ```javascript
  // Preferred for top-level functions
  export async function myFunction() { ... }
  ```

- Use **arrow functions** for callbacks and simple utility functions:
  ```javascript
  // Preferred for callbacks/simple utilities
  const formatName = (name) => name.toLowerCase().trim();
  ```

### Error Handling

- Use structured error handling with try/catch blocks
- Avoid process.exit() in library functions (only use in the top-level application)
- Bubble up errors rather than handling them at the lowest level
- Use descriptive error messages

```javascript
// Good
try {
  await performOperation();
} catch (error) {
  throw new Error(`Failed to complete operation: ${error.message}`);
}

// Avoid
try {
  await performOperation();
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
}
```

### Code Structure

- Group related functions in appropriate module files
- Follow the Command Pattern for CLI operations
- Use configuration objects rather than repeating string literals
- Minimize side effects in utility functions

### Naming Conventions

- **Files**: Use kebab-case for filenames (e.g., `file-utils.js`)
- **Functions**: Use camelCase for function names (e.g., `generateTemplate`)
- **Constants**: Use UPPER_SNAKE_CASE for constants (e.g., `DEFAULT_TEMPLATE_PATH`)
- **Classes**: Use PascalCase for class names (e.g., `TemplateManager`)

## Documentation Standards

### JSDoc Comments

All functions should include JSDoc comments following this format:

```javascript
/**
 * Brief description of what the function does
 *
 * @param {Type} paramName - Description of the parameter
 * @param {Type} [optionalParam] - Description of optional parameter
 * @returns {ReturnType} Description of return value
 * @throws {ErrorType} Description of potential errors
 * @example
 * // Example usage of the function
 * const result = myFunction('example');
 */
```

### Code Comments

- Use comments to explain "why", not "what" (the code should be self-explanatory)
- Add comments for complex logic or non-obvious behavior
- Keep comments up-to-date when changing code

## Testing Guidelines

- Write unit tests for utility functions
- Use mocks for file system operations
- Test error cases as well as successful operations

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following the coding standards
3. Update documentation and tests
4. Submit a pull request with a clear description of the changes

## Code Review Checklist

- [ ] Code follows style guidelines
- [ ] JSDoc comments are complete
- [ ] Error handling is robust
- [ ] No hardcoded values (use constants)
- [ ] No console.log statements (use a logger)
- [ ] Tests added/updated for changes

Thank you for helping improve Wizard Generator!
