document.addEventListener("DOMContentLoaded", (_event) => {
  // Connect to socket.io
  const socket = io(); // automatically tries to connect on same port app was served from
  const username = document.getElementById("uname").innerText;
  const form = document.getElementById("chatForm");
  const messages = document.getElementById("messages");
  const messageToSend = document.getElementById("txt");
  form.addEventListener("submit", (event) => {
    socket.emit("message", {
      user: username,
      message: messageToSend.value,
    });
    messageToSend.value = "";
    event.preventDefault();
  });

  // append the chat text message
  socket.on("message", (msg) => {
    const message = document.createElement("li");
    if (msg.green == true) {
      message.innerHTML = `<span style="color: green"><u><strong>${msg.user}</strong></u>: ${msg.message}</span>`;
    } else if (msg.red == true) {
      message.innerHTML = `<span style="color: red"><u><strong>${msg.user}</strong></u>: ${msg.message}</span>`;
    }
    else {
      message.innerHTML = `<u><strong>${msg.user}</strong></u>: ${msg.message}`;
    }
    messages.appendChild(message);
  });
});
