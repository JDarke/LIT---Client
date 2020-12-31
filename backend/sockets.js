const {
  createToken,
  addUser,
  getRooms,
  getUser,
  getUsers,
  getUserById,
  getUserByToken,
  getUserIndex,
  getUsersInRoom,
  getTime,
} = require("./utils");
const translate = require("@k3rn31p4nic/google-translate-api");

let users = getUsers();
let rooms = getRooms();

module.exports.listen = function (io, socket) {

  socket.on("send_message", (msg) => {
    let user = getUser(msg.userName);
    //console.log(msg.userName + " to " + user.room + ': ' + msg.text );
    if (user) {
      console.log(msg.userName + " to " + user.room + ": " + msg.text);
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
    } else {
      console.log("No user"); // emit an event here to tell client to go back to login screen...?
    }
  });




  socket.on("login", (name, token, nameIsTaken) => {
    let existingUser = getUser(name);
    if (existingUser) {
      console.log(existingUser.token, token);
      if (existingUser.token != token) {
        nameIsTaken(true);
      } else {
        // handle re-assign user to new socket // what about same token, diff name?
        existingUser.id = socket.client.id;
        existingUser.isOnline = true;
        nameIsTaken(false);
      }
    } else {
      addUser(name, socket.client.id, "");
      let user = getUser(name);
      getRooms();
      io.to(socket.client.id).emit("roomInfo", rooms); //  isnt this it??
      io.to(socket.client.id).emit("token", user.token);
      nameIsTaken(false);
      console.log(name + " logged in");
    }

    console.log("users: ", users);
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
        console.log(name + " created " + userRoom);
        console.log("users: ", users);
        console.log("rooms: ", rooms);
        //console.log(io.sockets.adapter.rooms);
      }
    }
  });




  socket.on("join", ({ name, userRoom }, roomNotFound) => {
    let existingRoom = rooms.find((room) => room === userRoom);
    //console.log("rooms: ",  rooms);

    if (!existingRoom) {
      roomNotFound(true);
    } else {
      let user = getUser(name);
      if (user) {
        roomNotFound(false);
        user.room = userRoom;
        socket.join(userRoom);
        socket.to(userRoom).emit("send_message", {
          userName: "admin",
          text: `${name} has joined ${userRoom}`,
          time: getTime(),
        });
        io.to(user.id).emit("send_message", {
          userName: "admin",
          text: `Welcome to ${userRoom}, ${name}!`,
          time: getTime(),
        });
        //getRooms();
        io.sockets.in(userRoom).emit("usersInRoom", getUsersInRoom(userRoom));
        console.log(name + " joined " + userRoom);
        console.log("users: ", users);
        console.log("rooms: ", rooms);
      }
    }
  });



  socket.on("retrieveUser", (token, retrieveUser) => {
    let user = getUserByToken(token);
    if (user) {
      user.id = socket.client.id;
      if (user.room) {
        socket.join(user.room);
        socket.to(user.room).emit("send_message", {
          userName: "admin",
          text: `${user.name} has reconnected`,
          time: getTime(),
        });
        io.to(user.id).emit("send_message", {
          userName: "admin",
          text: `Reconnected to ${user.room}`,
          time: getTime(),
        });
        console.log("retreiving: " + user.id + " " + user.room);
      }
      socket.join(user.room);  //////////////////////// may need moving
      getRooms();
      io.emit("roomInfo", rooms);
      io.sockets.in(user.room).emit("usersInRoom", getUsersInRoom(user.room));
      console.log("users: ", users);
      retrieveUser(user);
    } else {
        console.log('user not found - logging out') // add a status message to the login screen giving reason for return where needed
        io.to(socket.client.id).emit("logout");
    }
  });



  socket.on("leave", ({ name, room }) => {
    let user = getUser(name);
    if (user) {
      socket.to(room).emit("send_message", {
        userName: "admin",
        text: `${name} has left the room`,
        time: getTime(),
      });
      let index = getUserIndex(name);
      users[index].room = "";
    }
    socket.leave(room);
    getRooms();
    io.emit("roomInfo", rooms);

    io.sockets.in(room).emit("usersInRoom", getUsersInRoom(room)); 
    console.log(name + " left " + room);
    console.log("users: ", users);
    console.log("rooms: ", rooms);
  });




  socket.on("logout", () => {
    let user = getUserById(socket.client.id);
    if (user) {
      if (user.room !== "") {
        socket.to(user.room).emit("send_message", {
          //
          userName: "admin",
          text: `${user.name} has logged out`,
          time: getTime(),
        });
        let index = getUserIndex(user.name);
        let prevRoom = user.room;
        users[index].room = "";
        io.sockets.in(prevRoom).emit("usersInRoom", getUsersInRoom(prevRoom));
        socket.leave(prevRoom);
      }

      console.log(user.name + " logged out");
      //deleteUser(socket.client.id); // need some kind of tidy-up here, surely?
      user.isOnline = false;
      console.log("users:", ...users);
      getRooms();
    }
    io.emit("roomInfo", rooms);
  });




  socket.on("disconnect", (reason) => {
    console.log("User 1 disconnected because " + reason);
    io.clients((error, clients) => {
      if (error) throw error;
      console.log(clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
    });
    let user = getUserById(socket.client.id);
    if (user) {
      user.isOnline = false;
      if (user.room !== "") {
        socket.to(user.room).emit("send_message", {
          userName: "admin",
          text: `${user.name} has disconnected`,
          time: getTime(),
        });
        io.sockets.in(user.room).emit("usersInRoom", getUsersInRoom(user.room));   // replace updates like this with named functions like "updateUsersinRoom"
        socket.leave(user.room);
      }
    }

    getRooms();
    io.emit("roomInfo", rooms);
    console.log("user disconnected" + getTime());
    console.log("users: ", users);
    console.log("rooms: ", rooms);
  });



  socket.on("reconnect", () => {
    let user = getUserById(socket.client.id);
    if (user.room !== "") {
      socket.join(user.room);
      socket.to(user.room).emit("send_message", {
        userName: "admin",
        text: `${user.name} has re-connected ${user.room}`,
        time: getTime(),
      });
      socket.emit("rejoin", user.room);
    }
    getRooms();
    io.emit("roomInfo", rooms);

    console.log(user.name + "reconnected" + getTime());
    console.log("users: ", users);
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
    //console.log(name + " is typing...");
    let user = getUser(name);
    if (user) {
      socket.to(user.room).emit("typing", name);
    }
  });


};
