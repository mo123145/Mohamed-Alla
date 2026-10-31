(function () {
  const modal = document.getElementById('chatModal');
  const launcher = document.getElementById('aiChatBtn');
  if (!modal || !launcher) return;

  const chatBody = document.getElementById('chatBody');
  const chatInput = document.getElementById('chatInput');
  const sendButton = document.getElementById('chatSend');
  const quickReplies = document.getElementById('quickReplies');
  const storageKey = 'portfolio-ai-chat-v1';
  const maxHistoryLength = 12;
  let history = [];
  let sending = false;
  let previousFocus = null;

  function addMessage(text, isUser) {
    const message = document.createElement('div');
    message.className = `chat-msg ${isUser ? 'user' : 'ai'}`;

    const content = document.createElement('div');
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;

    const time = document.createElement('div');
    time.className = 'chat-time';
    time.textContent = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    if (isUser) time.style.textAlign = 'left';
    content.append(bubble, time);

    const avatar = document.createElement('div');
    avatar.className = `chat-msg-avatar${isUser ? ' user-av' : ''}`;
    if (isUser) {
      avatar.textContent = 'أنت';
    } else {
      const image = document.createElement('img');
      image.src = 'photo.jpg';
      image.alt = 'مساعد الموقع';
      avatar.appendChild(image);
    }

    if (isUser) message.append(content, avatar);
    else message.append(avatar, content);
    chatBody.appendChild(message);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function addTypingIndicator() {
    const message = document.createElement('div');
    message.className = 'chat-msg ai';
    message.id = 'typingIndicator';
    message.innerHTML = `
      <div class="chat-msg-avatar"><img src="photo.jpg" alt="مساعد الموقع" /></div>
      <div class="typing-bubble show">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>`;
    chatBody.appendChild(message);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingIndicator() {
    document.getElementById('typingIndicator')?.remove();
  }

  function setSendingState(isSending) {
    sending = isSending;
    sendButton.disabled = isSending;
    chatInput.disabled = isSending;
    launcher.disabled = isSending;
  }

  function saveHistory() {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(history.slice(-maxHistoryLength)));
    } catch (error) {
      console.error('Unable to save AI chat history:', error);
    }
  }

  function restoreHistory() {
    let savedHistory;
    try {
      savedHistory = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
    } catch (error) {
      console.error('Unable to read AI chat history:', error);
      return;
    }

    if (!Array.isArray(savedHistory) || savedHistory.length > maxHistoryLength) {
      console.error('Saved AI chat history has an invalid format.');
      return;
    }

    const validHistory = savedHistory.every((message, index) =>
      message &&
      message.role === (index % 2 === 0 ? 'user' : 'model') &&
      typeof message.text === 'string' &&
      message.text.trim() &&
      message.text.length <= 4000
    );
    if (!validHistory || savedHistory.length % 2 !== 0) {
      console.error('Saved AI chat history has an invalid conversation sequence.');
      return;
    }
    history = savedHistory;

    history.forEach(message => addMessage(message.text, message.role === 'user'));
    if (history.length > 0) quickReplies.hidden = true;
  }

  function openChat() {
    previousFocus = document.activeElement;
    modal.inert = false;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    launcher.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    chatInput.focus();
  }

  function closeChat() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modal.inert = true;
    launcher.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }

  async function sendMessage(text = chatInput.value) {
    const question = text.trim();
    if (!question || sending) return;

    chatInput.value = '';
    quickReplies.hidden = true;
    addMessage(question, true);
    history.push({ role: 'user', text: question });
    setSendingState(true);
    addTypingIndicator();

    try {
      const messages = history.slice(-maxHistoryLength);
      if (messages[0]?.role === 'model') messages.shift();
      const reply = await requestAIResponse(messages, 'portfolio');
      history.push({ role: 'model', text: reply });
      history = history.slice(-maxHistoryLength);
      saveHistory();
      removeTypingIndicator();
      addMessage(reply, false);
    } catch (error) {
      history.pop();
      removeTypingIndicator();
      addMessage(error.message || 'تعذر الاتصال بالمساعد الذكي. حاول مرة أخرى.', false);
    } finally {
      setSendingState(false);
      if (modal.classList.contains('open')) chatInput.focus();
    }
  }

  launcher.addEventListener('click', openChat);
  document.getElementById('chatClose').addEventListener('click', closeChat);
  sendButton.addEventListener('click', () => sendMessage());
  chatInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  });
  modal.addEventListener('click', event => {
    if (event.target === modal) closeChat();
  });
  quickReplies.addEventListener('click', event => {
    const button = event.target.closest('[data-chat-question]');
    if (button) sendMessage(button.dataset.chatQuestion);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeChat();
  });

  restoreHistory();
})();
