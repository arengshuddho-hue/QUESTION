// assets/js/chatbot.js
// Ei script ta pura chatbot widget ta (button + window + logic) inject
// kore, ebong /api/chat endpoint e call kore answer niye ashe.
// Kono onno file er sathe conflict korবে না — plain script hishebe kaj kore.

(function () {
  const fabHtml = `
    <button class="chatbot-fab" id="chatbotFab" title="Portal Assistant">
      <i class="fa-solid fa-comment-dots"></i>
    </button>
    <div class="chatbot-window" id="chatbotWindow">
      <div class="chatbot-header">
        <div class="chatbot-header-title">
          <i class="fa-solid fa-robot"></i> Portal Assistant
        </div>
        <button class="chatbot-close" id="chatbotClose">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="chatbot-messages" id="chatbotMessages"></div>
      <div class="chatbot-input-row">
        <input type="text" id="chatbotInput" placeholder="Website niye jigges koro..." />
        <button id="chatbotSend"><i class="fa-solid fa-paper-plane"></i></button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', fabHtml);

  const fab = document.getElementById('chatbotFab');
  const win = document.getElementById('chatbotWindow');
  const closeBtn = document.getElementById('chatbotClose');
  const messagesBox = document.getElementById('chatbotMessages');
  const input = document.getElementById('chatbotInput');
  const sendBtn = document.getElementById('chatbotSend');

  let history = []; // { role: 'user'|'assistant', content: '...' }

  function addMessage(text, who) {
    const div = document.createElement('div');
    div.className = 'chatbot-msg ' + who;
    div.innerText = text;
    messagesBox.appendChild(div);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  function openChat() {
    win.classList.add('on');
    if (messagesBox.children.length === 0) {
      addMessage('Hae! Ami portal er assistant. Website er kono feature, link, ba kivabe use korte hoy - jigges korte paro.', 'bot');
    }
    setTimeout(() => input.focus(), 50);
  }

  fab.addEventListener('click', openChat);
  closeBtn.addEventListener('click', () => win.classList.remove('on'));

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    sendBtn.disabled = true;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-msg bot';
    typingDiv.innerText = 'Likhchi...';
    messagesBox.appendChild(typingDiv);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      typingDiv.remove();

      if (!res.ok) {
        addMessage('Dukkhito, ekhon answer dite parlam na. Ektu pore abar try koro.', 'bot');
      } else {
        addMessage(data.reply, 'bot');
        history.push({ role: 'user', content: text });
        history.push({ role: 'assistant', content: data.reply });
        // history khub boro hoye gele purono gulo kete felo
        if (history.length > 12) history = history.slice(-12);
      }
    } catch (err) {
      typingDiv.remove();
      addMessage('Network problem hocche, ektu por abar try koro.', 'bot');
    } finally {
      sendBtn.disabled = false;
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
})();