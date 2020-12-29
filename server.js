const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const translate = require("@k3rn31p4nic/google-translate-api");
const PORT = process.env.PORT || 8080; // was 5000
const path = require("path");
const fetch = require("node-fetch");
const droom = "main lounge";
let userRoom = droom;
const getTime = () => {
  let d = new Date();
  return d.toLocaleTimeString().slice(0, -3);
};

const users = [];
let rooms = [];

// const getData = async (url, data) => {
     //const response = 
     // fetch('https://words.bighugelabs.com/api/2/8e1da03335ab50e9e051ab2b746e7e57/happy/json', {
     //      method: 'GET', 
     //      mode: 'cors',
     //    }).then(res => res.json()).then(data => console.log(data));
        //console.log(response);
        //return response;
// }
//getData('https://words.bighugelabs.com/api/2/8e1da03335ab50e9e051ab2b746e7e57/happy/json')
//console.log(x);

const addUser = (name, id, room) => {
  // if (!users.find(user => user.name === name)) {
  users.push({ name, id, room });
  // }
};

const deleteUser = (id) => {
  let index = users
    .map((user) => {
      return user.id === id;
    })
    .indexOf(true);
  users.splice(index, 1);
};

const getRooms = () => {
  rooms = [];
  users.forEach((user) => {
    if (user.room) {
      let roomExists = rooms.indexOf(user.room);
      if (roomExists === -1) {
        rooms.push(user.room);
      }
    }
  });
  return rooms;
};

const getUser = (name) => {
  let user = users.find((user) => user.name === name);
  return user;
};

const getUsersInRoom = (room) => {
  let usersInRoom = [];
  users.forEach((user) => {
    if (user.room === room) {
      usersInRoom.push(user);
    }
  });
  return usersInRoom;
};

io.on("connection", (socket) => {
  console.log("user connected: " + socket.client.id + ' ' + getTime());

  socket.on("send_message", (msg) => {
    console.log(msg.userName + ": " + msg.text);
    let user = getUser(msg.userName);
    if (user) {
      if (msg.lit) {
        let newMsg = msg;
        translate(msg.text, {
          to: "zh-cn",
        })
          .then((res) => {
            // console.log(res.text);
            console.log(res.text);
            newMsg.text = res.text;
            //io.sockets.in(user.room).emit('send_message', newMsg);
          })
          .catch((err) => {
            console.error(err);
          })
          .then(
            translate(newMsg.text, {
              to: "cs",
            })
              .then((res) => {
                console.log(res.text);
                newMsg.text = res.text;
                //io.sockets.in(user.room).emit('send_message', newMsg);
              })
              .catch((err) => {
                console.error(err);
              })
              .then(
                translate(newMsg.text, {
                  to: "en",
                })
                  .then((res) => {
                    // console.log(res.text);
                    newMsg.text = res.text;
                    io.sockets.in(user.room).emit("send_message", newMsg);
                  })
                  .catch((err) => {
                    console.error(err);
                  })
              )
          );
      } else {
        io.sockets.in(user.room).emit("send_message", msg);
      }
    }
  });

  socket.on("lit-mode", (litModeActive, name, room) => {
    console.log(name + " " + room);
    if (name && room) {
      let txt = litModeActive ? "activated" : "deactivated";
      io.sockets.in(room).emit("send_message", {
        userName: "admin",
        text: `${name} ${txt} LIT mode!`,
        time: getTime(),
      });
      //io.sockets.in(room).emit('lit-mode', litModeActive) // for translate-everyone mode
    }
  });

  socket.on("typing", (name) => {
    console.log(name + " is typing...");
    let user = getUser(name);
    if (user) {
      socket.to(user.room).emit("typing", name);
    }
  });

  socket.on("login", (name, nameIsTaken) => {
    let existingUser = getUser(name);
    if (existingUser) {
      nameIsTaken(true);
    } else {
      addUser(name, socket.client.id, "");
      io.to(socket.client.id).emit("roomInfo", rooms);
      nameIsTaken(false);
    }
    console.log(users);
  });

  socket.on("create", ({ name, userRoom }, roomNameIsTaken) => {
    let existingRoom = rooms.find((room) => room === userRoom);
    if (existingRoom) {
      roomNameIsTaken(true);
    } else {
      let user = getUser(name);
      if (user) {
        roomNameIsTaken(false);
        user.room = userRoom;
        socket.join(userRoom);
        io.sockets.in(userRoom).emit("send_message", {
          userName: "admin",
          text: `${name} created new room - ${userRoom}!`,
          time: getTime(),
        });
        getRooms();
        io.emit("roomInfo", rooms);
        io.sockets.in(userRoom).emit("usersInRoom", getUsersInRoom(userRoom));

        console.log(users);
        console.log(rooms);
        //console.log(io.sockets.adapter.rooms);
      }
    }
  });

  socket.on("join", ({ name, userRoom }, roomNotFound) => {
    let existingRoom = rooms.find((room) => room === userRoom);
    console.log(rooms);
    console.log(userRoom);
    if (!existingRoom) {
      roomNotFound(true);
    } else {
      let user = getUser(name);
      if (user) {
        roomNotFound(false);
        user.room = userRoom;
        socket.join(userRoom);
        socket.broadcast.emit("send_message", {
          userName: "admin",
          text: `${name} has joined ${userRoom}`,
          time: getTime(),
        });
        io.to(user.id).emit("send_message", {
          userName: "admin",
          text: `Welcome to ${userRoom}, ${name}!`,
          time: getTime(),
        });
        getRooms();
        io.sockets.in(userRoom).emit("usersInRoom", getUsersInRoom(userRoom));

        console.log(users);
        console.log(rooms);
      }
    }
  });

  socket.on("leave", ({ name, room }) => {
    socket.broadcast.emit("send_message", {  // this should also be room-targeted
      userName: "admin",
      text: `${name} has left the room`,
      time: getTime(),
    });
    let user = getUser(name);
    if (user) {
      user.room = "";
    }
    socket.leave(room);
    getRooms();
    io.emit("roomInfo", rooms);

    io.sockets.in(room).emit("usersInRoom", getUsersInRoom(room));  // was userRoom  !?  // also, shouldnt this only be sent to that room?  This seems to broadcast to all rooms and may overwrite their lists
    

    console.log(users);
    console.log(rooms);
  });

  socket.on("logout", () => {
    deleteUser(socket.client.id);
    getRooms();

    console.log(users);
  });

  socket.on("disconnect", () => {
    deleteUser(socket.client.id);
    getRooms();

    console.log("user disconnected" + getTime());
    console.log(users);
  });
});

// app.use(router);
app.use(express.static(path.join(__dirname, "build")));
//app.use(express.static('C:/Users/UnitA/Projects/LIT/LIT---Client/build/'));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});
// app.get('/', (req, res) => {
//      res.sendFile('C:/Users/UnitA/Projects/LIT/LIT---Client/build/index.html');
// })

// app.get('/', (req, res) => {
//      res.sendFile('C:/Users/UnitA/Projects/Socket-test/index.html');
//  });

// app.get('/', (req, res) => {
//       res.send('Successful GET')
// })

http.listen(PORT, () => {
  // was server
  console.log(`Server started on port ${PORT}`);
});

// translate('ich bin ein auslander', {
//     to: 'en'
// }).then(res => {
//     console.log(res.text);
//     console.log(res.from.language.iso);
// }).catch(err => {
//     console.error(err);
// });

// translate(msg, {
//      to: 'de'
//      }).then(res => {
//      // console.log(res.text);
//      socket.emit('reply', res.text);
//      }).catch(err => {
//      console.error(err);
// });
