# MCPクライアントからの使用方法

## MCPクライアントでの設定

### 1. MCPサーバーとして登録

MCPクライアント（Claude Code、Claude Desktop等）の設定ファイルに以下を追加してください。

#### macOS / Linux / WSL の場合

Claude Code CLI:

```bash
claude mcp add voicevox -- npx @t09tanaka/mcp-simple-voicevox
```

JSON設定ファイル:

```json
{
  "mcpServers": {
    "voicevox": {
      "command": "npx",
      "args": ["@t09tanaka/mcp-simple-voicevox"]
    }
  }
}
```

#### Windows（ネイティブ）の場合

Claude Code CLI:

```bash
claude mcp add voicevox -- cmd /c npx @t09tanaka/mcp-simple-voicevox
```

JSON設定ファイル:

```json
{
  "mcpServers": {
    "voicevox": {
      "command": "cmd",
      "args": ["/c", "npx", "@t09tanaka/mcp-simple-voicevox"]
    }
  }
}
```

### 2. 前提条件

- VOICEVOXエンジンが起動している（`http://localhost:50021`）
- Node.js がインストールされている

### 3. 使用例

MCPクライアントを再起動後、`speak`ツールが利用できます。

```json
{
  "text": "こんにちは、テストです",
  "speaker": 1,
  "speedScale": 1.3,
  "async": true
}
```

## 他のMCPクライアントでの使用

### 直接実行での動作確認

MCPサーバーが正しく動作するかテストするには：

```bash
# サーバーを起動
npm start

# 別のターミナルでテスト（標準入力でMCPプロトコルを送信）
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | npm start
```

### カスタムMCPクライアント

独自のMCPクライアントから使用する場合：

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

// MCPサーバープロセスを起動
const serverProcess = spawn('node', ['dist/index.js']);

// クライアントを作成
const transport = new StdioClientTransport({
  stdin: serverProcess.stdin!,
  stdout: serverProcess.stdout!,
});

const client = new Client(
  {
    name: 'voicevox-client',
    version: '1.0.0',
  },
  {
    capabilities: {},
  }
);

await client.connect(transport);

// speakツールを呼び出し
const result = await client.request(
  {
    method: 'tools/call',
    params: {
      name: 'speak',
      arguments: {
        text: 'こんにちは、世界！',
        speaker: 1,
      },
    },
  },
  {}
);

console.log(result);
```

## トラブルシューティング

### VOICEVOXが見つからない場合

```bash
# VOICEVOXエンジンが起動しているか確認
curl http://localhost:50021/speakers
```

### MCPサーバーが認識されない場合

1. パスが正しいか確認
2. Node.jsがインストールされているか確認
3. ビルドが完了しているか確認（`dist/index.js`が存在するか）
4. Claude Codeを完全に再起動

### 権限エラーの場合

```bash
# 実行権限を付与
chmod +x dist/index.js
```

## 話者IDの確認

使用可能な話者IDを確認：

```bash
curl http://localhost:50021/speakers | jq '.[].styles[].id'
```

よく使用される話者ID：

- 1: 四国めたん（ノーマル）
- 3: 四国めたん（ツンツン）
- 8: 春日部つむぎ（ノーマル）
- 10: 雨晴はう（ノーマル）
