# MCP-VOICEVOX

MCP (Model Context Protocol) を通じてVOICEVOXのテキスト読み上げ機能を提供するサーバーです。

## 概要

このプロジェクトは、VOICEVOXの音声合成エンジンをMCPツールとして利用できるようにするサーバー実装です。Claude Code等のMCPクライアントから、テキストの読み上げ機能を簡単に利用できます。

## 前提条件

- Node.js 18.0.0 以上
- **VOICEVOXエンジンが起動している必要があります**
  - [VOICEVOX公式サイト](https://voicevox.hiroshiba.jp/)からVOICEVOXをダウンロード・インストール
  - VOICEVOXを起動し、エンジンが `http://localhost:50021` で稼働していることを確認

## インストール

```bash
# リポジトリをクローン
git clone https://github.com/your-username/mcp-voicevox.git
cd mcp-voicevox

# 依存関係をインストール
npm install

# ビルド
npm run build
```

## 使用方法

### MCPサーバーとして起動

```bash
npm start
```

### MCPクライアントから利用

MCPクライアント（Claude Code等）で以下のツールが利用できます。

**設定方法の詳細は [docs/usage.md](docs/usage.md) を参照してください。**

#### `speak` ツール

テキストを音声で読み上げます。

**パラメータ:**
- `text` (string, 必須): 読み上げるテキスト
- `speaker` (number, 必須): 話者ID

**使用例:**
```json
{
  \"text\": \"こんにちは、これはテスト音声です。\",
  \"speaker\": 1
}
```

### 話者IDについて

VOICEVOXで利用可能な話者IDは、VOICEVOXエンジンの `/speakers` エンドポイントから取得できます：

```bash
curl http://localhost:50021/speakers
```

一般的な話者ID（参考）：
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

### VOICEVOXエンジンに接続できない

- VOICEVOXアプリケーションが起動しているか確認
- `http://localhost:50021` でVOICEVOX APIが利用可能か確認
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