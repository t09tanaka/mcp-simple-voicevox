# MCP-VOICEVOX 仕様書

## 概要

MCP-VOICEVOXは、Model Context Protocol (MCP) を通じてVOICEVOXのテキスト読み上げ機能を提供するサーバーです。

## 機能仕様

### 読み上げ機能 (speak)

VOICEVOXを使用してテキストを音声に変換し、読み上げを行います。

#### パラメータ

| パラメータ名 | 型      | 必須 | 説明                                                                  |
| ------------ | ------- | ---- | --------------------------------------------------------------------- |
| text         | string  | ✓    | 読み上げるテキスト                                                    |
| speaker      | number  | ✓    | 話者ID（VOICEVOXの話者番号）                                          |
| speedScale   | number  |      | 読み上げ速度のスケール（0.5〜2.0、デフォルト: 1.0）                   |
| volumeScale  | number  |      | 音量のスケール（0.0〜2.0、デフォルト: 1.0）                           |
| async        | boolean |      | 非同期再生モード（falseの場合、音声再生完了を待つ。デフォルト: true） |

#### 使用例

```json
{
  "text": "こんにちは、これはテスト音声です。",
  "speaker": 1,
  "speedScale": 1.3,
  "volumeScale": 1.5,
  "async": true
}
```

#### 処理フロー

1. MCPクライアントから `speak` ツールが呼び出される
2. パラメータ `text`、`speaker`、オプションで `speedScale`、`volumeScale`、`async` を受け取る
3. VOICEVOXのAPIを使用して音声合成を実行
4. `async: true`（デフォルト）の場合は音声再生をバックグラウンドで開始し、即座にレスポンスを返却
5. `async: false` の場合は音声再生完了後にレスポンスを返却

#### 戻り値

成功時：

```json
{
  "success": true,
  "message": "おしゃべり完了"
}
```

エラー時：

```json
{
  "success": false,
  "error": "エラーメッセージ"
}
```

## VOICEVOX連携

### 前提条件

- **VOICEVOXエンジンが別途起動している必要があります**
- VOICEVOXエンジンは事前にユーザーが起動させておく必要があります
- デフォルトのVOICEVOX APIエンドポイント: `http://localhost:50021`
- VOICEVOXエンジンの起動確認は本MCPサーバーの責任範囲外とします

### 話者ID

VOICEVOXで利用可能な話者IDは、VOICEVOXのAPIエンドポイント `/speakers` から取得できます。

## 技術仕様

### MCP Server

- Node.js / TypeScript で実装
- MCP SDK を使用してMCPサーバーを構築
- VOICEVOXとの通信にはHTTP APIを使用

### 依存関係

- `@modelcontextprotocol/sdk-typescript`: MCP SDK
- `node-fetch` または `axios`: HTTP通信
- その他必要な依存関係

## 制限事項

- 現在のMVPでは読み上げ機能（speak）のみを提供
- 音声ファイルの保存機能は含まれません
- 複数の音声の同時生成には対応していません
- VOICEVOXエンジンの起動・停止は本MCPサーバーでは行いません
- VOICEVOXエンジンが起動していない場合はエラーを返します
