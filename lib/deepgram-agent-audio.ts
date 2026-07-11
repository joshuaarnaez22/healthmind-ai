/**
 * Align audio Settings with Deepgram's working Voice Agent sample:
 * input linear16 @ 48000, output linear16 @ 24000 + container "none".
 *
 * The SDK omits `audio.output.container` unless we patch it; without
 * `container: "none"`, header bytes can play as rhythmic clicks.
 */
import { AgentSession } from '@deepgram/agents';

/** Matches Deepgram console sample + AgentPlayer default. */
const OUTPUT_SAMPLE_RATE = 24_000;
/** Matches Deepgram working Settings sample (`audio.input.sample_rate`). */
const INPUT_SAMPLE_RATE = 48_000;

type SettingsPayload = {
  audio?: {
    input?: Record<string, unknown>;
    output?: Record<string, unknown>;
  };
};

type SessionProto = {
  _buildSettingsPayload?: () => SettingsPayload;
  __healthmindAudioPatched?: boolean;
};

let didPatch = false;

export function ensureDeepgramAgentAudioDefaults() {
  if (didPatch || typeof window === 'undefined') return;
  didPatch = true;

  const proto = AgentSession.prototype as unknown as SessionProto;
  const original = proto._buildSettingsPayload;
  if (typeof original !== 'function' || proto.__healthmindAudioPatched) return;

  proto._buildSettingsPayload = function patchedBuildSettings(
    this: unknown
  ): SettingsPayload {
    const settings = original.call(this);

    settings.audio = settings.audio ?? {};
    settings.audio.input = {
      encoding: 'linear16',
      ...settings.audio.input,
      sample_rate: INPUT_SAMPLE_RATE,
    };
    settings.audio.output = {
      encoding: 'linear16',
      ...settings.audio.output,
      sample_rate: OUTPUT_SAMPLE_RATE,
      container: 'none',
    };

    return settings;
  };
  proto.__healthmindAudioPatched = true;
}

export const DEEPGRAM_PLAYER_SAMPLE_RATE = OUTPUT_SAMPLE_RATE;
export const DEEPGRAM_MIC_SAMPLE_RATE = INPUT_SAMPLE_RATE;
