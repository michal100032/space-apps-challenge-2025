document.getElementById("sendBtn").addEventListener("click", sendMessage);

function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBody = document.getElementById("chatBody");
  const message = input.value.trim();

  if (message === "") return;

  // Wiadomość użytkownika
  const userMsg = document.createElement("div");
  userMsg.className = "user-message";
  userMsg.textContent = message;
  chatBody.appendChild(userMsg);

  input.value = "";

  // Odpowiedź chatbota (prosta)
  setTimeout(() => {
    const botMsg = document.createElement("div");
    botMsg.className = "bot-message";
    botMsg.textContent = "It seems your mission will require both sunlight and access to ice. A landing site near the northern polar region might provide both.";
    chatBody.appendChild(botMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 600);

  chatBody.scrollTop = chatBody.scrollHeight;
}