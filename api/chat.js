// api/chat.js
// Ei file ta Vercel Serverless Function hishebe kaj korbe.
// Path: /api/chat.js  -> deploy hobar por endpoint hobe: https://tomar-site.vercel.app/api/chat
//
// SETUP:
// 1. Vercel dashboard e giye Project -> Settings -> Environment Variables e
//    ANTHROPIC_API_KEY name diye tomar Anthropic API key ta add koro.
// 2. Ei file ta tomar project er root e "api" folder er moddhe rakho.
// 3. "knowledge-base.js" file ta o project root e rakho (ekhane import kora hocche).

const { PORTAL_INFO } = require('../knowledge-base.js');

module.exports = async function handler(req, res) {
  // Shudhu POST request allow kora hocche
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message required' });
  }

  const systemPrompt = `Tumi CSE-57 Section C Academic Portal er official assistant.
Tomar kaj holo website er feature, navigation, ebong "kivabe use korte hoy"
shongkranto question er answer deya.

Niche website er shob information deya ache. Shudhu ei information use kore
answer dibe. Kono kichu na jana thakle bole dibe je tumi nishchit na, admin er
sathe jogajog korte bolbe.

Bangla ebong English mixed kore (jevabe Bangladeshi students kotha bole) reply
dibe, shudhu jodi user Bangla te question na kore. Answer choto o clear rakhba.
Jodi kono direct link deyar moto hoy, seta o diye dibe.

=== WEBSITE INFORMATION ===
${PORTAL_INFO}
`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: systemPrompt,
        messages: [
          ...(Array.isArray(history) ? history : []),
          { role: 'user', content: message },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', errText);
      return res.status(500).json({ error: 'AI response failed' });
    }

    const data = await response.json();
    const textBlock = data.content.find((block) => block.type === 'text');
    const reply = textBlock ? textBlock.text : 'Answer generate kora jayni.';

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
