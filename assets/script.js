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
    document.getElementById('messages').scrollTop = message.offsetHeight + message.offsetTop;
  });

  socket.on("joined-message", (user) => {
    const message = document.createElement("li");
    message.innerHTML = `<span style="color: #99ff99"><u><strong>BlooChatApp</strong></u>: ${user.user} has joined the room.</span>`;
    messages.appendChild(message);
    document.getElementById('messages').scrollTop = message.offsetHeight + message.offsetTop;
  });

  socket.on("welcome-message", (user) => {
    const message = document.createElement("li");
    message.innerHTML = `<span style="color: #99ff99"><u><strong>BlooChatApp</strong></u>: Welcome, ${user.user}!</span>`;
    messages.appendChild(message);
    document.getElementById('messages').scrollTop = message.offsetHeight + message.offsetTop;
  });

  socket.on("online-users-message", (info) => {
    const message = document.createElement("li");
    if (info.users == "") {
      message.innerHTML = `<span style="color: #99ff99"><u><strong>BlooChatApp</strong></u>: Unfortunately, nobody is online at the moment.</span>`;
    } else {
      message.innerHTML = `<span style="color: #99ff99"><u><strong>BlooChatApp</strong></u>: Online users: ${info.users}</span>`;
    }
    messages.appendChild(message);
    document.getElementById('messages').scrollTop = message.offsetHeight + message.offsetTop;
  });

  socket.on("disconnect-message", (info) => {
    const message = document.createElement("li");
    message.innerHTML = `<span style="color: #ff6666"><u><strong>BlooChatApp</strong></u>: ${info.user} has disconnected.</span>`;
    messages.appendChild(message);
    document.getElementById('messages').scrollTop = message.offsetHeight + message.offsetTop;
  });

});
