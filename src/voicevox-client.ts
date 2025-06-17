import axios, { AxiosInstance } from 'axios';

export interface SpeakOptions {
  text: string;
  speaker: number;
  speedScale?: number;
}

export class VoicevoxClient {
  private client: AxiosInstance;

  constructor(private endpoint: string) {
    this.client = axios.create({
      baseURL: endpoint,
      timeout: 30000,
    });
  }

  async speak(text: string, speaker: number, speedScale?: number): Promise<void> {
    try {
      // 音声クエリの作成
      const queryResponse = await this.client.post('/audio_query', null, {
        params: {
          text,
          speaker,
        },
      });

      const audioQuery = queryResponse.data;

      // 速度スケールが指定されている場合は設定
      if (speedScale !== undefined) {
        audioQuery.speedScale = speedScale;
      }

      // 音声合成
      const synthesisResponse = await this.client.post('/synthesis', audioQuery, {
        params: {
          speaker,
        },
        responseType: 'arraybuffer',
      });

      // 音声データの再生（一時的に音声ファイルとして保存して再生）
      await this.playAudio(synthesisResponse.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('VOICEVOXエンジンに接続できません。VOICEVOXが起動しているか確認してください。');
        }
        throw new Error(`VOICEVOX APIエラー: ${error.response?.status} ${error.response?.statusText}`);
      }
      throw error;
    }
  }

  private async playAudio(audioData: ArrayBuffer): Promise<void> {
    const fs = await import('fs');
    const path = await import('path');
    const { spawn } = await import('child_process');
    const os = await import('os');

    return new Promise((resolve, reject) => {
      const tempFilePath = path.join(os.tmpdir(), `voicevox_${Date.now()}.wav`);
      
      // 音声データを一時ファイルに保存
      fs.writeFileSync(tempFilePath, Buffer.from(audioData));

      // プラットフォームに応じた再生コマンドを選択
      let command: string;
      let args: string[];

      switch (process.platform) {
        case 'darwin': // macOS
          command = 'afplay';
          args = [tempFilePath];
          break;
        case 'linux':
          command = 'aplay';
          args = [tempFilePath];
          break;
        case 'win32': // Windows
          command = 'powershell';
          args = ['-c', `(New-Object Media.SoundPlayer "${tempFilePath}").PlaySync()`];
          break;
        default:
          fs.unlinkSync(tempFilePath);
          reject(new Error(`サポートされていないプラットフォーム: ${process.platform}`));
          return;
      }

      const player = spawn(command, args);

      player.on('close', (code) => {
        // 一時ファイルを削除
        try {
          fs.unlinkSync(tempFilePath);
        } catch (e) {
          console.error('一時ファイルの削除に失敗:', e);
        }

        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`音声再生に失敗しました。終了コード: ${code}`));
        }
      });

      player.on('error', (error) => {
        // 一時ファイルを削除
        try {
          fs.unlinkSync(tempFilePath);
        } catch (e) {
          console.error('一時ファイルの削除に失敗:', e);
        }
        reject(new Error(`音声再生エラー: ${error.message}`));
      });
    });
  }

  async getSpeakers(): Promise<unknown[]> {
    try {
      const response = await this.client.get('/speakers');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('VOICEVOXエンジンに接続できません。VOICEVOXが起動しているか確認してください。');
        }
        throw new Error(`VOICEVOX APIエラー: ${error.response?.status} ${error.response?.statusText}`);
      }
      throw error;
    }
  }
}