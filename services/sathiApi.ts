// This service calls Grok 4.1 Fast via OpenRouter with reasoning enabled.

interface AIRequest {
  intent: 'explain' | 'hint' | 'debug' | 'motivate';
  context: string;
  message: string;
  track?: string;
  ageGroup?: string;
}

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const buildUserPrompt = (req: AIRequest) => {
  return `
You are Sathi, a friendly coding coach for kids.
Intent: ${req.intent}
Track: ${req.track || 'general'}
Context: ${req.context}
User message: ${req.message}
Keep answers short, encouraging, and kid-friendly.`;
};

export const askSathiAI = async (request: AIRequest): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    return 'AI is sleeping right now (missing OPENROUTER key).';
  }

  const userMessage = buildUserPrompt(request);

  try {
    // First call with reasoning enabled
    const firstResp = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'x-ai/grok-4.1-fast',
        messages: [{ role: 'user', content: userMessage }],
        reasoning: { enabled: true },
      }),
    });

    if (!firstResp.ok) {
      const text = await firstResp.text();
      throw new Error(`OpenRouter error: ${text}`);
    }

    const firstJson = await firstResp.json();
    const assistantMessage = firstJson.choices?.[0]?.message;
    if (!assistantMessage) throw new Error('Missing assistant message from Grok.');

    // Preserve reasoning_details in the follow-up call
    const messages = [
      { role: 'user', content: userMessage },
      {
        role: 'assistant',
        content: assistantMessage.content,
        reasoning_details: assistantMessage.reasoning_details,
      },
      {
        role: 'user',
        content: 'Are you sure? Double-check and give your best final answer for the learner.',
      },
    ];

    const secondResp = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'x-ai/grok-4.1-fast',
        messages,
      }),
    });

    if (!secondResp.ok) {
      const text = await secondResp.text();
      throw new Error(`OpenRouter error: ${text}`);
    }

    const secondJson = await secondResp.json();
    const finalMessage = secondJson.choices?.[0]?.message?.content;
    return finalMessage || 'I had trouble getting a response. Please try again.';
  } catch (err: any) {
    console.error('askSathiAI error', err);
    return 'Sathi hit a snag reaching the AI. Please try again soon.';
  }
};
