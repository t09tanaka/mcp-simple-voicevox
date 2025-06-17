import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { VoicevoxClient } from './voicevox-client.js';

const VOICEVOX_ENDPOINT = 'http://localhost:50021';

class VoicevoxMCPServer {
  private server: Server;
  private voicevoxClient: VoicevoxClient;

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-voicevox',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.voicevoxClient = new VoicevoxClient(VOICEVOX_ENDPOINT);
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'speak',
            description: 'VOICEVOXを使用してテキストを読み上げます',
            inputSchema: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  description: '読み上げるテキスト',
                },
                speaker: {
                  type: 'number',
                  description: '話者ID（VOICEVOXの話者番号）',
                },
              },
              required: ['text', 'speaker'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'speak') {
        try {
          const { text, speaker } = request.params.arguments as {
            text: string;
            speaker: number;
          };

          await this.voicevoxClient.speak(text, speaker);

          return {
            content: [
              {
                type: 'text',
                text: '音声の読み上げが完了しました',
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `エラー: ${error instanceof Error ? error.message : '不明なエラー'}`,
              },
            ],
            isError: true,
          };
        }
      }

      throw new Error(`Unknown tool: ${request.params.name}`);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP VOICEVOX Server running on stdio');
  }
}

async function main() {
  const server = new VoicevoxMCPServer();
  await server.run();
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
}