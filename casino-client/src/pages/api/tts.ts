import type { NextApiRequest, NextApiResponse } from 'next';

// Voice: "Daniel" — British, deep, authoritative. Perfect for a shady casino dealer.
// Browse voices at https://elevenlabs.io/voice-library
const VOICE_ID = 'wQnWpNdhzre7NbiPEUS9';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { text } = req.body as { text?: string };
  if (!text) return res.status(400).json({ error: 'Missing text' });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'ELEVENLABS_API_KEY not configured' });

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5',   // fastest + cheapest model
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.80,
            style: 0.30,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('ElevenLabs error:', err);
      return res.status(502).json({ error: err });
    }

    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({ error: String(err) });
  }
}
