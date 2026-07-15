import type { NextApiRequest, NextApiResponse } from 'next';
import Groq from 'groq-sdk';

type Action = 'new_game' | 'hit' | 'double' | 'stand' | 'chat';
type Outcome = 'Win' | 'Lost' | 'Push' | 'Split';

interface GameContext {
  action: Action;
  playerTotal: number;
  dealerVisibleCard: string;
  playerCards: string[];
  outcome?: Outcome;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  gameContext: GameContext;
}

type ApiResponse = { reply: string } | { error: string };

const ACTION_DESCRIPTIONS: Record<Action, string> = {
  new_game: 'A new game just started and the initial cards were dealt',
  hit:      'The player just hit and drew a new card',
  double:   'The player doubled down and drew one card',
  stand:    'The player stood; the dealer revealed their hidden cards',
  chat:     'The player is talking to you directly',
};

// Synthetic user trigger for auto-events (keeps conversation valid: must end with user turn)
const ACTION_TRIGGERS: Record<Exclude<Action, 'chat'>, string> = {
  new_game: 'Deal the cards.',
  hit:      'Hit me.',
  double:   'Double down!',
  stand:    'I\'ll stand.',
};

function buildSystemPrompt(ctx: GameContext): string {
  return `You are a sarcastic, shady blackjack dealer at a shady crypto casino on the Ethereum Sepolia network. \
You comment on the game with dark humor and casino slang. \
Respond in 1 short or 2 sentences only. Never break character. Never give actual blackjack strategy advice.

Current game state:
- Situation: ${ACTION_DESCRIPTIONS[ctx.action]}
- Player total: ${ctx.playerTotal}
- Player cards: ${ctx.playerCards.join(', ')}
- Dealer visible card: ${ctx.dealerVisibleCard}${
    ctx.outcome ? `\n- Game outcome: ${ctx.outcome}` : ''
  }`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, gameContext } = req.body as RequestBody;

  if (!messages || !gameContext) {
    return res.status(400).json({ error: 'Missing messages or gameContext' });
  }

  // For auto-triggered events (not player chat), ensure conversation ends with a user message
  const conversationMessages = [...messages];
  if (gameContext.action !== 'chat') {
    const lastRole = conversationMessages.at(-1)?.role;
    if (!lastRole || lastRole === 'assistant') {
      conversationMessages.push({ role: 'user', content: ACTION_TRIGGERS[gameContext.action] });
    }
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 60,
      messages: [
        { role: 'system', content: buildSystemPrompt(gameContext) },
        ...conversationMessages,
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim() ?? '...';
    return res.status(200).json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Groq API error:', message);
    return res.status(500).json({ error: message });
  }
}
