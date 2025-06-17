# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

これは `@t09tanaka/mcp-simple-voicevox` として提供される、VOICEVOX統合のためのMCP（Model Context Protocol）サーバー実装プロジェクトです。

## 開発環境セットアップ

プロジェクトは.gitignore設定に基づきNode.jsを使用します。プロジェクト構造が確立されると、一般的なコマンドは以下になる予定です：

- `npm install` - 依存関係のインストール
- `npm run build` - プロジェクトのビルド  
- `npm run dev` - 開発モード
- `npm test` - テストの実行
- `npm link` - ローカルnpxリンクの作成
- `npx @t09tanaka/mcp-simple-voicevox` - サーバーの実行

## アーキテクチャ

このリポジトリはVOICEVOXを通じてテキスト読み上げ機能を提供するMCPサーバーを実装する予定です。MCPサーバーはVOICEVOXのAPIを使用してテキストから音声を生成するためのツールとリソースを公開します。

## ドキュメント管理

- 仕様書は `docs/` ディレクトリで管理します
- MVPのTODOは `docs/TODO.md` で管理します
- 仕様が変更される場合は、必ず `docs/specification.md` を更新してください
- 実装前に仕様書を確認し、実装後は仕様との整合性を確認してください

## 開発ワークフロー

- 開発中は適切な粒度でコミットを行ってください
- 各コミットは論理的にまとまった変更を含むようにします
- 機能追加、バグ修正、リファクタリングなど、変更の性質に応じて適切に分割します
- コミットメッセージは変更内容を明確に説明し、なぜその変更が必要だったかを記述します

*注記：このCLAUDE.mdはプロジェクト構造とコードベースの開発に伴って更新されます。*