import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { z } from "zod";

async function testMathServer() {
  // Create a client that connects to our server
  const client = new Client({ 
    name: "MathJS-Client", 
    version: "1.0.0" 
  }, {
    capabilities: {
      experimental: {},
      sampling: {},
      roots: {}
    }
  });

  try {
    // Connect to the server using stdio transport
    const transport = new StdioClientTransport({
      command: "node",
      args: ["build/index.js"]
    });
    
    await client.connect(transport);
    
    console.log('Connected to MathJS MCP Server');

    // Define schemas for responses
    const listToolsSchema = z.object({
      tools: z.array(z.object({
        name: z.string(),
        description: z.string().optional(),
        inputSchema: z.any().optional()
      }))
    });

    const toolResultSchema = z.object({
      toolResult: z.object({
        content: z.array(z.object({
          type: z.string(),
          text: z.string()
        }))
      }).optional(),
      error: z.object({
        code: z.number(),
        message: z.string()
      }).optional()
    });

    // List available tools
    const toolsResponse = await client.request(
      { method: "list_tools", params: {} },
      listToolsSchema
    );
    
    console.log("Available tools:", toolsResponse.tools.map(t => t.name));

    // Test basic calculations
    console.log('\n--- Basic Calculations ---');
    const expressions = [
      '2 + 2',
      'sin(45 deg)',
      'sqrt(16)',
      '2^8',
      '5 * (3 + 2) / 4'
    ];

    for (const expression of expressions) {
      try {
        const response = await client.request(
          { 
            method: "call_tool", 
            params: {
              name: "calculate",
              arguments: { expression }
            }
          },
          toolResultSchema
        );
        console.log(`Expression: ${expression}`);
        console.log(`Result:`, response);
        console.log('---');
      } catch (error) {
        console.error(`Error calculating "${expression}":`, error);
      }
    }

    // Test derivatives
    console.log('\n--- Derivatives ---');
    const derivatives = [
      { expression: 'x^2', variable: 'x' },
      { expression: 'sin(x)', variable: 'x' },
      { expression: 'e^x', variable: 'x' }
    ];

    for (const { expression, variable } of derivatives) {
      try {
        const response = await client.request(
          { 
            method: "call_tool", 
            params: {
              name: "derivative",
              arguments: { expression, variable }
            }
          },
          toolResultSchema
        );
        console.log(`Derivative of ${expression} with respect to ${variable}`);
        console.log(`Result:`, response);
        console.log('---');
      } catch (error) {
        console.error(`Error calculating derivative of "${expression}":`, error);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Disconnect from the server
    await client.close();
    console.log('Disconnected from server');
  }
}

// Run the test
// testMathServer();
console.log("Client example - uncomment testMathServer() to run"); 