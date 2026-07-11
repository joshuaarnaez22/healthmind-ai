export type TherapyJournalContext = {
  title: string;
  mood: string;
  content: string;
  addedAt: Date | string;
};

const CONTENT_TRUNCATE = 400;
const JOURNAL_CONTEXT_CAP = 3000;

/** Deepgram-managed think model (matches working Voice Agent console sample). */
export const AI_THERAPY_THINK_PROVIDER = 'google' as const;
export const AI_THERAPY_THINK_MODEL = 'gemini-3.1-flash-lite';

function formatAddedAt(addedAt: Date | string): string {
  const d = typeof addedAt === 'string' ? new Date(addedAt) : addedAt;
  return d.toISOString().slice(0, 10);
}

function truncate(text: string, max: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

export function buildJournalContextBlock(
  journals: TherapyJournalContext[]
): string {
  if (!journals.length) {
    return 'No recent journal context yet.';
  }

  const lines: string[] = [];
  let used = 0;

  for (const j of journals) {
    const snippet = truncate(j.content, CONTENT_TRUNCATE);
    const line = `- [${formatAddedAt(j.addedAt)}] mood=${j.mood} | ${j.title}: ${snippet}`;
    if (used + line.length + 1 > JOURNAL_CONTEXT_CAP) break;
    lines.push(line);
    used += line.length + 1;
  }

  if (!lines.length) {
    return 'No recent journal context yet.';
  }

  return lines.join('\n');
}

function displayName(userName?: string | null): string | null {
  const trimmed = userName?.trim();
  return trimmed ? trimmed : null;
}

/**
 * Voice-first prompt (structured like Deepgram's working agent samples).
 * Keep replies short — they are spoken aloud.
 */
export function buildAiTherapyPrompt(
  journals: TherapyJournalContext[],
  userName?: string | null
): string {
  const journalBlock = buildJournalContextBlock(journals);
  const name = displayName(userName);
  const whoBlock = name
    ? `The user's name is ${name}. Address them by first name naturally when it fits — do not overuse it.`
    : "The user's name is unknown. Do not invent a name; use warm second-person address.";

  return `# Role
You are HealthMind's AI voice therapy companion — a warm, calm, evidence-informed mental health coach with grounding in CBT, DBT, and ACT.

# Who You're Talking To
${whoBlock}

# General Guidelines
- Be warm, friendly, and professional.
- Speak clearly and naturally in plain language.
- Keep most responses to 1–2 short sentences (under ~120 characters) unless the user asks for more (max ~300 characters).
- Do not use markdown, code blocks, bullets with symbols, bold, links, or italics.
- Ask one thoughtful question at a time.
- If unclear, ask for clarification.
- Never invent personal details about the user.
- You are NOT a licensed therapist, doctor, or crisis counselor. Do not diagnose, prescribe, or claim to provide clinical treatment.
- This is educational support, not a substitute for professional care.

# Voice-Specific Instructions
- Speak in a conversational tone — your responses will be spoken aloud.
- Pause after questions to allow for replies.
- Prefer reflective listening over lectures.
- Confirm what the user said if uncertain.
- Never interrupt.

# Crisis
If the user expresses crisis, self-harm, suicidal ideation, or an emergency: urge them to contact local emergency services or the 988 Suicide & Crisis Lifeline (US) immediately, and stop giving coping advice that could delay help.

# Ending the Session
When the user clearly wants to end the call — goodbye, bye, that's all, I'm done, end the session, hang up, talk later, have a good day (as a closing):
1. Say one brief warm farewell sentence.
2. Then call the end_session function.
Do NOT call end_session if they only say thanks but are still continuing the conversation.

# Journal Context
Use the following only as gentle background. Do not recite entries verbatim unless the user brings them up.

${journalBlock}`;
}

export function buildAiTherapyGreeting(
  journals: TherapyJournalContext[],
  userName?: string | null
): string {
  const name = displayName(userName);
  const hello = name ? `Hi ${name}` : 'Hi';

  if (journals.length > 0) {
    return `${hello}, I'm here with you. I've taken a light look at your recent journal themes — what would you like to explore today?`;
  }
  return `${hello}, I'm here with you. What's on your mind today?`;
}

/** Client-side tool — agent calls this when the user wants to hang up. */
export const END_SESSION_FUNCTION = {
  name: 'end_session',
  description: `End the voice therapy session and close the connection. Call this ONLY when the user clearly wants to finish.

Call when:
- User says goodbye, bye, see you, talk later
- User says they're done ("that's all", "I'm all set", "I'm done", "end the session", "hang up")
- User closes with thanks + farewell ("thanks, have a good day")

Do NOT call when:
- User only says thanks but continues talking
- User is pausing mid-thought
- The conversation is still going`,
  parameters: {
    type: 'object',
    properties: {
      reason: {
        type: 'string',
        description: 'Why the session is ending',
        enum: ['goodbye', 'done', 'user_request', 'thanks'],
      },
    },
    required: ['reason'],
  },
} as const;

/**
 * Agent config aligned with Deepgram's working Voice Agent Settings sample:
 * - listen: nova-3 (+ medical variant fits health context)
 * - think: managed Google Gemini (no custom endpoint)
 * - speak: Aura-2
 * - end_session function for intent-based hangup (client-side)
 * Audio I/O rates are applied client-side (48k in / 24k out, container none).
 */
export function buildAiTherapySettings({
  journals,
  userName,
}: {
  journals: TherapyJournalContext[];
  userName?: string | null;
}) {
  return {
    listen: {
      provider: {
        type: 'deepgram' as const,
        version: 'v1',
        model: 'nova-3-medical',
        language: 'en',
      },
    },
    think: {
      provider: {
        type: AI_THERAPY_THINK_PROVIDER,
        model: AI_THERAPY_THINK_MODEL,
      },
      prompt: buildAiTherapyPrompt(journals, userName),
      functions: [END_SESSION_FUNCTION],
    },
    speak: {
      provider: {
        type: 'deepgram' as const,
        model: 'aura-2-thalia-en',
      },
    },
    greeting: buildAiTherapyGreeting(journals, userName),
  };
}

export type AiTherapyAgentSettings = ReturnType<typeof buildAiTherapySettings>;
