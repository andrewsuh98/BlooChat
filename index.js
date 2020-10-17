const debug = require("debug")("bloo-chat");
const nunjucks = require("nunjucks");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const users = {};

const port = process.env.PORT || 7000;

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.use(express.static("assets"));

app.get("/", (req, res) => {
  res.render("index.njk", null);
});

app.get("/chatroom", (req, res) => {
  res.render("chatroom.njk", { uname: req.query.uname });
});

io.on("connection", function (socket) {

  socket.on("login", (login) => { // TODO: show current online users

    socket.broadcast.emit("joined-message", {
      user: login.user,
    });

    socket.emit("welcome-message", {
      user: login.user,
    });

    let onlineUsers = "";
    let i = 0;
    for (const [key, value] of Object.entries(users)) {
      if (i == 0) {
        onlineUsers = onlineUsers.concat(value.toString());
      } else {
        onlineUsers = onlineUsers.concat(", ", value.toString());
      }
      i++;
    }
    socket.emit("online-users-message", {
      users: onlineUsers,
    });
    onlineUsers = "";

    users[socket.id] = login.user;
  });


  socket.on("message", (msg) => {
    debug(`${msg.user}: ${msg.message}`);
    //Broadcast the message to everyone
    io.emit("message", msg);
  });

  socket.on('disconnect', () => {
    io.emit("message", { // TODO: append user name
      user: "BlooChatApp",
      message: "NAME has disconnected.",
      red: true,
    });
  });

});

http.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});