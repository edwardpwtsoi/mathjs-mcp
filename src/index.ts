#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as math from 'mathjs';

// Create an MCP server
const server = new Server({
  name: "MathJS-Calculator",
  version: process.env.npm_package_version || "dev"
}, {
  capabilities: {
    tools: {}
  }
});

// Define our tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "calculate",
        description: "Evaluate a mathematical expression",
        inputSchema: {
          type: "object",
          properties: {
            expression: { type: "string" }
          },
          required: ["expression"]
        }
      },
      {
        name: "derivative",
        description: "Calculate the derivative of an expression with respect to a variable",
        inputSchema: {
          type: "object",
          properties: {
            expression: { type: "string" },
            variable: { type: "string" }
          },
          required: ["expression", "variable"]
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  
  if (name === "calculate") {
    try {
      const expression = args.expression as string;
      if (!expression) {
        throw new Error("Expression is required");
      }
      
      const result = math.evaluate(expression);
      return { 
        "jsonrpc": "2.0",
        "id": 2,
        "result": {
          "content": [
            {
              "type": "text",
              "text": `The result of the expression is: ${result.toString()}`
            }
          ],
          "isError": false
        }
      };
    } catch (error) {
      return { 
        "jsonrpc": "2.0",
        "id": 2,
        "result": {
          "content": [
            {
              "type": "text",
              "text": `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          "isError": true
        }
      };
    }
  }
  
  if (name === "derivative") {
    try {
      const expression = args.expression as string;
      const variable = args.variable as string;
      
      if (!expression || !variable) {
        throw new Error("Both expression and variable are required");
      }
      
      const result = math.derivative(expression, variable).toString();
      return { 
        "jsonrpc": "2.0",
        "id": 2,
        "result": {
          "content": [
            {
              "type": "text",
              "text": `The derivative of ${expression} with respect to ${variable} is: ${result}`
            }
          ],
          "isError": false
        }
      };
    } catch (error) {
      return { 
        "jsonrpc": "2.0",
        "id": 2,
        "result": {
          "content": [
            {
              "type": "text",
              "text": `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          "isError": true
        }
      };
    }
  }
  
  return {
    error: {
      code: -32601,
      message: "Tool not found"
    }
  };
});

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);

console.error(`MathJS MCP Server started (v${process.env.npm_package_version})`);
