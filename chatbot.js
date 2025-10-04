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
    botMsg.textContent = "This is an example response from a chatbot.";
    chatBody.appendChild(botMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 600);

  chatBody.scrollTop = chatBody.scrollHeight;
}