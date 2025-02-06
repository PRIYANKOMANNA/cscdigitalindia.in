document.addEventListener("DOMContentLoaded", function () {
    const chatbotBtn = document.getElementById("chatbot-btn");
    const chatWindow = document.getElementById("chat-window");
    const closeChat = document.getElementById("close-chat");
    const sendBtn = document.getElementById("sendBtn");
    const userInput = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");

    // Toggle Chat Window
    chatbotBtn.addEventListener("click", function () {
        chatWindow.style.display = chatWindow.style.display === "block" ? "none" : "block";
    });

    closeChat.addEventListener("click", function () {
        chatWindow.style.display = "none";
    });

    sendBtn.addEventListener("click", async function () {
        let userText = userInput.value.trim();
        if (!userText) return;

        chatbox.innerHTML += `<p><strong>You:</strong> ${userText}</p>`;
        userInput.value = "";

        try {
            let response = await fetch("https://your-app-name.herokuapp.com/deepseek", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: userText })
            });

            let data = await response.json();
            chatbox.innerHTML += `<p><strong>AI:</strong> ${data.response}</p>`;
            chatbox.scrollTop = chatbox.scrollHeight;
        } catch (error) {
            chatbox.innerHTML += `<p style="color:red;"><strong>Error:</strong> Unable to fetch response</p>`;
        }
    });
});
