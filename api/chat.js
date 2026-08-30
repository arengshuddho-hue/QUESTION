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

  // Groq OpenAI-compatible format: { role: 'user'|'assistant', content: '...' }
  const messages = [
    { role: 'system', content: systemPrompt },
    ...(Array.isArray(history) ? history : []),
    { role: 'user', content: message },
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
       model: 'openai/gpt-oss-120b',
        messages: messages,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error:', errText);
      return res.status(500).json({ error: 'AI response failed' });
    }

    const data = await response.json();
    const reply =
      data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message.content
        : 'Answer generate kora jayni.';

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};