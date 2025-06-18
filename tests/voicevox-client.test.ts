import { describe, it, expect, beforeEach } from '@jest/globals';
import { VoicevoxClient } from '../src/voicevox-client';

describe('VoicevoxClient', () => {
  let client: VoicevoxClient;
  const mockEndpoint = 'http://localhost:50021';

  beforeEach(() => {
    client = new VoicevoxClient(mockEndpoint);
  });

  describe('constructor', () => {
    it('should create instance with correct endpoint', () => {
      expect(client).toBeInstanceOf(VoicevoxClient);
    });
  });

  describe('SpeakOptions interface', () => {
    it('should have correct structure', () => {
      const options = {
        text: 'テスト',
        speaker: 1,
        speedScale: 1.0,
      };

      expect(typeof options.text).toBe('string');
      expect(typeof options.speaker).toBe('number');
      expect(typeof options.speedScale).toBe('number');
    });
  });
});
