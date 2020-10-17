document.addEventListener("DOMContentLoaded", (_event) => {
  // Connect to socket.io
  const socket = io(); // automatically tries to connect on same port app was served from
  const username = document.getElementById("uname").innerText;
  const form = document.getElementById("chatForm");
  const messages = document.getElementById("messages");
  const messageToSend = document.getElementById("txt");

  socket.emit("login", {
    user: username,
  });

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
    message.innerHTML = `<u><strong>${msg.user}</strong></u>: ${msg.message}`;
    messages.appendChild(message);
  });

  socket.on("joined-message", (user) => {
    const message = document.createElement("li");
    message.innerHTML = `<span style="color: green"><u><strong>${"BlooChatApp"}</strong></u>: ${user.user} ${"has joined the room."} </span>`;
    messages.appendChild(message);
  });

  socket.on("welcome-message", (user) => {
    const message = document.createElement("li");
    message.innerHTML = `<span style="color: green"><u><strong>${"BlooChatApp"}</strong></u>: ${"Welcome, "} ${user.user}  </span>`;
    messages.appendChild(message);
  });

  socket.on("online-users-message", (info) => {
    const message = document.createElement("li");
    message.innerHTML = `<span style="color: green"><u><strong>${"BlooChatApp"}</strong></u>: ${"Online users: "} ${info.users}  </span>`;
    messages.appendChild(message);
  });

  socket.on("disconnect-message", (info) => {
    const message = document.createElement("li");
    message.innerHTML = `<span style="color: red"><u><strong>${"BlooChatApp"}</strong></u>: ${info.user} ${" has disconnected."}</span>`;
    messages.appendChild(message);
  });

});
