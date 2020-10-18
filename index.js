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

  socket.on("login", (login) => {
    // announce to everybody except this user that a new user has joined
    socket.broadcast.emit("joined-message", {
      user: login.user,
    });

    // show a welcome message to the new user
    socket.emit("welcome-message", {
      user: login.user,
    });

    // show the list of all online users
    const onlineUsers = onlineUsersToString();
    socket.emit("online-users-message", {
      users: onlineUsers,
    });

    // add this user to the object of users
    users[socket.id] = login.user;
  });

  // send a regular message to everyone
  socket.on("message", (msg) => {
    debug(`${msg.user}: ${msg.message}`);
    //Broadcast the message to everyone
    io.emit("message", msg);
  });

  // on disconnect, tell everybody that this user has disconnected,
  // then delete the user from the object of users.
  socket.on('disconnect', () => {
    io.emit("disconnect-message", {
      user: users[socket.id],
    });
    delete users[socket.id];
  });

});

http.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});

// returns the list of users as a string
function onlineUsersToString() {
  let i = 0;
  let str = "";
  for (const [key, value] of Object.entries(users)) {
    if (i == 0) {
      str = str.concat(value.toString());
    } else {
      str = str.concat(", ", value.toString());
    }
    i++;
  }
  return str;
}