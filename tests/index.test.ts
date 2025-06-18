import { describe, it, expect } from '@jest/globals';
import { VoicevoxClient } from '../src/voicevox-client';

describe('VoicevoxMCPServer', () => {
  it('should import VoicevoxClient successfully', () => {
    expect(VoicevoxClient).toBeDefined();
  });

  it('should have correct endpoint configuration', () => {
    const client = new VoicevoxClient('http://localhost:50021');
    expect(client).toBeInstanceOf(VoicevoxClient);
  });
});