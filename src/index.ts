#!/usr/bin/env node

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
                speedScale: {
                  type: 'number',
                  description: '読み上げ速度のスケール（デフォルト1.0）',
                  minimum: 0.5,
                  maximum: 2.0,
                },
                volumeScale: {
                  type: 'number',
                  description: '音量のスケール（デフォルト1.0）',
                  minimum: 0.0,
                  maximum: 2.0,
                },
                async: {
                  type: 'boolean',
                  description:
                    '非同期再生モード（falseの場合、音声再生の完了を待ちます。デフォルトtrue）',
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
          const {
            text,
            speaker,
            speedScale,
            volumeScale,
            async: isAsync = true,
          } = request.params.arguments as {
            text: string;
            speaker: number;
            speedScale?: number;
            volumeScale?: number;
            async?: boolean;
          };

          if (isAsync) {
            this.voicevoxClient
              .speak(text, speaker, speedScale, volumeScale)
              .catch((e) => console.error(e));
          } else {
            await this.voicevoxClient.speak(
              text,
              speaker,
              speedScale,
              volumeScale
            );
          }

          return {
            content: [
              {
                type: 'text',
                text: 'おしゃべり完了',
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `エラー: ${
                  error instanceof Error ? error.message : '不明なエラー'
                }`,
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

    // プロセス終了時の処理
    process.on('SIGINT', () => {
      console.error('Received SIGINT, shutting down...');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.error('Received SIGTERM, shutting down...');
      process.exit(0);
    });
  }
}

async function main() {
  const server = new VoicevoxMCPServer();
  await server.run();
}

// メインモジュールとして実行された場合
main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
