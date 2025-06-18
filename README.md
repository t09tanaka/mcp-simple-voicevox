# @t09tanaka/mcp-simple-voicevox

MCP (Model Context Protocol) を通じて VOICEVOX のテキスト読み上げ機能を提供するシンプルなサーバーです。

## 概要

このプロジェクトは、VOICEVOX の音声合成エンジンを MCP ツールとして利用できるようにするサーバー実装です。Claude Code 等の MCP クライアントから、テキストの読み上げ機能を簡単に利用できます。

## 前提条件

- Node.js 18.0.0 以上
- **VOICEVOX エンジンが起動している必要があります**
  - [VOICEVOX 公式サイト](https://voicevox.hiroshiba.jp/)から VOICEVOX をダウンロード・インストール
  - VOICEVOX を起動し、エンジンが `http://localhost:50021` で稼働していることを確認

## インストール

### npm からインストール（推奨）

```bash
npm install -g @t09tanaka/mcp-simple-voicevox
```

### ソースからインストール

```bash
# リポジトリをクローン
git clone https://github.com/t09tanaka/mcp-simple-voicevox.git

# 依存関係をインストール
npm install

# ビルド
npm run build

# グローバルリンク（オプション）
npm link
```

## 使用方法

### MCP サーバーとして起動

#### 方法 1: npm パッケージから実行（推奨）

```bash
# グローバルインストール後
mcp-simple-voicevox

# または npx で直接実行
npx @t09tanaka/mcp-simple-voicevox
```

#### 方法 2: ソースから直接実行

```bash
# プロジェクトディレクトリで
npm start
```

### MCP クライアントから利用

MCP クライアント（Claude Code 等）で以下のツールが利用できます。

**設定方法の詳細は [docs/usage.md](docs/usage.md) を参照してください。**

#### `speak` ツール

テキストを音声で読み上げます。

**パラメータ:**

- `text` (string, 必須): 読み上げるテキスト
- `speaker` (number, 必須): 話者 ID
- `speedScale` (number, オプション): 読み上げ速度のスケール（0.5〜2.0、デフォルト: 1.0）

**使用例:**

```json
{
  \"text\": \"こんにちは、これはテスト音声です。\",
  \"speaker\": 1,
  \"speedScale\": 1.3
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

## 開発

### 開発モード

```bash
npm run dev
```

### リント

```bash
npm run lint
```

### テスト

```bash
npm test
```

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

### 音声が再生されない

- 対応プラットフォームか確認
- 音声再生コマンドがインストールされているか確認
  - Linux: `aplay` (alsa-utils)
  - その他のプラットフォームは通常デフォルトで利用可能

## ライセンス

Apache License 2.0

## 貢献

プルリクエストや Issue の報告は歓迎します。詳細な仕様は `docs/specification.md` を参照してください。
