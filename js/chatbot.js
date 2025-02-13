document.addEventListener("DOMContentLoaded", () => {
    // Configuration
    const CONFIG = {
        API_ENDPOINT: "https://your-app-name.herokuapp.com/deepseek",
        MAX_MESSAGES: 50,
        THROTTLE_DELAY: 1000,
        MESSAGE_TTL: 3600000 // 1 hour in milliseconds
    };

    // DOM Elements
    const DOM = {
        chatbotBtn: document.getElementById("chatbot-btn"),
        chatWindow: document.getElementById("chat-window"),
        closeChat: document.getElementById("close-chat"),
        sendBtn: document.getElementById("sendBtn"),
        userInput: document.getElementById("userInput"),
        chatbox: document.getElementById("chatbox")
    };

    // State Management
    let isSending = false;
    let lastSent = 0;

    // Helpers
    const sanitizeInput = (input) => {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    };

    const addMessage = (message, isUser = true) => {
        const timestamp = new Date().toLocaleTimeString();
        const messageClass = isUser ? 'user-message' : 'bot-message';
        const messageHTML = `
            <div class="message ${messageClass}">
                <div class="message-header">
                    <strong>${isUser ? 'You' : 'AI'}</strong>
                    <span class="timestamp">${timestamp}</span>
                </div>
                <div class="message-content">${sanitizeInput(message)}</div>
            </div>
        `;
        DOM.chatbox.insertAdjacentHTML('beforeend', messageHTML);
        DOM.chatbox.scrollTop = DOM.chatbox.scrollHeight;
    };

    const toggleUIState = (isLoading = false) => {
        DOM.sendBtn.disabled = isLoading;
        DOM.sendBtn.innerHTML = isLoading
            ? '<div class="spinner"></div>'
            : 'Send';
    };

    // Event Handlers
    const handleSendMessage = async () => {
        if (isSending) return;

        const userText = DOM.userInput.value.trim();
        if (!userText) return;

        // Throttle requests
        const now = Date.now();
        if (now - lastSent < CONFIG.THROTTLE_DELAY) return;
        lastSent = now;

        try {
            isSending = true;
            toggleUIState(true);
            addMessage(userText, true);
            DOM.userInput.value = '';

            const response = await fetch(CONFIG.API_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: JSON.stringify({ query: userText })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            addMessage(data.response, false);
            saveChatHistory();
        } catch (error) {
            console.error('Chat Error:', error);
            addMessage(`Error: ${error.message} - Please try again later.`, false);
        } finally {
            isSending = false;
            toggleUIState(false);
        }
    };

    // Event Listeners
    DOM.chatbotBtn.addEventListener("click", () => {
        DOM.chatWindow.classList.toggle('visible');
    });

    DOM.closeChat.addEventListener("click", () => {
        DOM.chatWindow.classList.remove('visible');
    });

    DOM.sendBtn.addEventListener("click", handleSendMessage);

    DOM.userInput.addEventListener("keypress", (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Chat History Management
    const saveChatHistory = () => {
        const messages = Array.from(DOM.chatbox.children)
            .slice(-CONFIG.MAX_MESSAGES)
            .map(el => el.outerHTML);

        localStorage.setItem('chatHistory', JSON.stringify({
            messages,
            timestamp: Date.now()
        }));
    };

    const loadChatHistory = () => {
        const history = JSON.parse(localStorage.getItem('chatHistory'));
        if (history && Date.now() - history.timestamp < CONFIG.MESSAGE_TTL) {
            DOM.chatbox.innerHTML = history.messages.join('');
            DOM.chatbox.scrollTop = DOM.chatbox.scrollHeight;
        }
    };

    // Initialization
    loadChatHistory();
});