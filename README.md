# @t09tanaka/mcp-simple-voicevox

MCP (Model Context Protocol) を通じて VOICEVOX のテキスト読み上げ機能を提供するシンプルなサーバーです。

## 概要

このプロジェクトは、VOICEVOX の音声合成エンジンを MCP ツールとして利用できるようにするサーバー実装です。Claude Code 等の MCP クライアントから、テキストの読み上げ機能を簡単に利用できます。

## 前提条件

- Node.js 18.0.0 以上
- **VOICEVOX エンジンが起動している必要があります**
  - [VOICEVOX 公式サイト](https://voicevox.hiroshiba.jp/)から VOICEVOX をダウンロード・インストール
  - VOICEVOX を起動し、エンジンが `http://localhost:50021` で稼働していることを確認

## 使用方法

MCP クライアント（Claude Code、Claude Desktop 等）の設定ファイルに以下を追加してください。

#### macOS / Linux / WSL

```bash
claude mcp add voicevox -- npx @t09tanaka/mcp-simple-voicevox
```

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

#### Windows（ネイティブ）

```bash
claude mcp add voicevox -- cmd /c npx @t09tanaka/mcp-simple-voicevox
```

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

**その他の設定方法は [docs/usage.md](docs/usage.md) を参照してください。**

#### `speak` ツール

テキストを音声で読み上げます。

**パラメータ:**

- `text` (string, 必須): 読み上げるテキスト
- `speaker` (number, 必須): 話者 ID
- `speedScale` (number, オプション): 読み上げ速度のスケール（0.5〜2.0、デフォルト: 1.0）
- `volumeScale` (number, オプション): 音量のスケール（0.0〜2.0、デフォルト: 1.0）
- `async` (boolean, オプション): 非同期再生モード（falseの場合、音声再生の完了を待ちます。デフォルト: true）

**使用例:**

```json
{
  \"text\": \"こんにちは、これはテスト音声です。\",
  \"speaker\": 1,
  \"speedScale\": 1.3,
  \"volumeScale\": 1.5,
  \"async\": true
}
```

### 話者 ID について

VOICEVOX で利用可能な話者 ID は、VOICEVOX エンジンの `/speakers` エンドポイントから取得できます：

```bash
curl http://localhost:50021/speakers
```

一般的な話者 ID（参考）：

- 1: 四国めたん（ノーマル）
- 2: 四国めたん（あまあま）
- 3: 四国めたん（ツンツン）
- 8: 春日部つむぎ（ノーマル）
- 10: 雨晴はう（ノーマル）

## 対応プラットフォーム

音声再生は以下のプラットフォームに対応しています：

- **macOS**: `afplay` コマンドを使用
- **Linux**: `aplay` コマンドを使用
- **Windows**: PowerShell の `Media.SoundPlayer` を使用

## トラブルシューティング

### VOICEVOX エンジンに接続できない

- VOICEVOX アプリケーションが起動しているか確認
- `http://localhost:50021` で VOICEVOX API が利用可能か確認
- ファイアウォールの設定を確認

### Windows で "Connection closed" エラーが発生する

- Windows（ネイティブ）では `npx` を直接実行できないため、`cmd /c` 経由で実行する必要があります
- 上記の「Windows（ネイティブ）」の設定例を参照してください

### 音声が再生されない

- 対応プラットフォームか確認
- 音声再生コマンドがインストールされているか確認
  - Linux: `aplay` (alsa-utils)
  - その他のプラットフォームは通常デフォルトで利用可能

## ライセンス

Apache License 2.0

## 貢献

プルリクエストや Issue の報告は歓迎します。詳細な仕様は `docs/specification.md` を参照してください。
