# MathJS Calculator MCP Server

An MCP server implementation that provides mathematical calculation capabilities using the MathJS library.

## Features

- Evaluate mathematical expressions
- Calculate derivatives of expressions
- Handle complex mathematical operations
- Provide clear error messages for invalid inputs

## Tools

### calculate

Evaluates mathematical expressions and returns the result.

**Inputs:**

- `expression` (string): The mathematical expression to evaluate

### derivative

Calculates the derivative of a mathematical expression with respect to a variable.

**Inputs:**

- `expression` (string): The mathematical expression to differentiate
- `variable` (string): The variable to differentiate with respect to

## Usage

The MathJS Calculator tool is designed for:

- Evaluating mathematical expressions
- Computing derivatives
- Handling complex calculations
- Providing clear feedback for calculation errors

## Configuration

### Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

#### npx

```json
{
  "mcpServers": {
    "mathjs-calculator": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-mathjs-calculator"
      ]
    }
  }
}
```

## Building and Testing

### Build

To build the project:

```bash
npm install
npm run build
```

### Testing with Inspector

To test the server with the MCP Inspector:

1. Open the MCP Inspector in another terminal:
```bash
npm run inspector
```

1. Connect to the server at `http://localhost:5173` (default port)

2. Test the available tools:
   - Use the "calculate" tool to evaluate expressions
   - Use the "derivative" tool to compute derivatives

## Example Usage

```javascript
// Calculate expression
{
  "expression": "2 * (3 + 4)"
}
// Result: 14

// Calculate derivative
{
  "expression": "x^2 + 2*x",
  "variable": "x"
}
// Result: The derivative of x^2 + 2*x with respect to x is: 2*x + 2
```

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.
