const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const SCREEN_ROOM = `|InteractiveScreen|screen`;
const PORT = 3001;
const app = express();

app.use(express.static(__dirname));

const server = http.Server(app);
const websocket = socketio(server, { pingTimeout: 30000 });
server.listen(PORT, () => console.log("listening on *:" + PORT));

var connectedUsers = {};
const namespace = websocket.of("/theinteractivescreen");

// The event will be called when a client is connected.
namespace.on("connection", socket => {
  socket.on("emoji", function(msg) {
    connectedUsers[msg.email] = socket;
    console.log("msg", msg);
    if (SCREEN_ROOM) {
      connectedUsers[msg.email].broadcast.to(SCREEN_ROOM).emit("emoji", msg);
      console.log(`sent to room ${SCREEN_ROOM}`);
    }
  });

  socket.on("room", function(room) {
    let myroom = room;
    socket.join(myroom);
  });
});
