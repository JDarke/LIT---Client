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

io.eio.pingTimeout = 10000; // x10
io.eio.pingInterval = 30000; 
const users = [];
let rooms = [];



// Make one "update data" function/source?  It can send only the changed info, but should be a single function.

// currently not destroying actual socket rooms, so re creating with same name room actually joins an existing one.  This should have tidy up actions when rooms array is modified.


// use simple auth token to allow reconnects? Math.random(1 - 100) ...see WWM.   Maybe store it in localstorage for client..?
// store users even after disconnect;  add an 'isOnline' prop to users, along with token, and then they can reconnect easily.  If they reconnect and have a room prop, they go back to chat, else back to rooms.  Or poss have the login screen say 'Hi Dave' if already logged in, with a continue button and a Chnage User link.
//  Each time the server is fired up, user info should persist for as long as the session, even if users log out and back in.

// ref https://hackernoon.com/enforcing-a-single-web-socket-connection-per-user-with-node-js-socket-io-and-redis-65f9eb57f66a

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

const createToken = () => {
  let token = Math.random(1 - 100).toString();
  return token;
}

const addUser = (name, id, room) => {
  // if (!users.find(user => user.name === name)) {
  users.push({ name, id, room, token: createToken(), isOnline: true });

  // }
};

const deleteUser = (id) => {
  console.log('users before delete: ', users)
  let index = users
    .map((user) => {
      return user.id === id;
    })
    .indexOf(true);
  if (index !== -1 ) {
    users.splice(index, 1);
  }
  
  console.log('users after delete: ', users)
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

const getUserById = (id) => {
  let user = users.find((user) => user.id === id);
  return user;
};

const getUserByToken = (token) => {
  let user = users.find((user) => user.token === token);
  return user;
}

const getUserIndex = (name) => {
  let index = users.findIndex((user) => user.name === name);
  return index;
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
  console.log("user connected: " + socket.client.id + " " + getTime());
  io.clients((error, clients) => {
    if (error) throw error;
    console.log(clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
  });
  getRooms();

  // do we need to ping the room info to users on connection?  Is it currently being done only when entering rooms? --fix - see above


// TO FIX:  A created room on the pc didnt appear on my phone app list, and when I created a room with the same name, it joined to the room.  it allowed create action, but actually joined.  Need to update room info better/sooner, and trace the create/join overlap.



  socket.on("send_message", (msg) => {
    
    let user = getUser(msg.userName);
    //console.log(msg.userName + " to " + user.room + ': ' + msg.text );
    if (user) {
      console.log(msg.userName + " to " + user.room + ': ' + msg.text );
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
      console.log('No user');
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
    //console.log(name + " is typing...");
    let user = getUser(name);
    if (user) {
      socket.to(user.room).emit("typing", name);
    }
  });

  socket.on("login", (name, token, nameIsTaken) => {
    let existingUser = getUser(name);
    if (existingUser) {
      console.log(existingUser.token, token)
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
      let user = getUser(name)
      getRooms();
      io.to(socket.client.id).emit("roomInfo", rooms); //  isnt this it??
      io.to(socket.client.id).emit("token", user.token);
      nameIsTaken(false);
      console.log(name + " logged in");
    }
    
    console.log('users: ', users);
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
        console.log(name +  " created " + userRoom);
        console.log("users: ",  users);
        console.log("rooms: ",  rooms);
        //console.log(io.sockets.adapter.rooms);
      }
    }
  });

  socket.on("join", ({ name, userRoom }, roomNotFound) => {
    getRooms();
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
        getRooms();
        io.sockets.in(userRoom).emit("usersInRoom", getUsersInRoom(userRoom));
        console.log(name +  " joined " + userRoom);
        console.log("users: ",  users);
        console.log("rooms: ",  rooms);
      }
    }
  });

  socket.on('retrieveUser', (token, retrieveUser) => {
    let user = getUserByToken(token);
    if (user) {
      user.id = socket.client.id;
      if (user.room) {
        socket.join(user.room);
        socket.to(user.room).emit("send_message", {
          userName: "admin",
          text: `${user.name} has joined ${user.room}`,
          time: getTime(),
        }); 
        io.to(user.id).emit("send_message", {
          userName: "admin",
          text: `Rejoined ${user.room}`,
          time: getTime(),
        });
        console.log('retreiving: ' + user.id + ' ' + user.room)
      }
      getRooms();
      io.emit("roomInfo", rooms);
      console.log('users: ', users)
      retrieveUser(user);
    }
  })

  socket.on("leave", ({ name, room }) => {
    
    let user = getUser(name);
    if (user) {
      socket.to(room).emit("send_message", {
        //
        userName: "admin",
        text: `${name} has left the room`,
        time: getTime(),
      });
      //  users = users.map(user => {
      //      let updatedUser = user;
      //      if (user.name === name) {
      //           updatedUser.room = '';
      //      }
      //      return updatedUser;
      //  });
      let index = getUserIndex(name);
      users[index].room = "";
    }
    socket.leave(room);
    getRooms();
    io.emit("roomInfo", rooms);

    io.sockets.in(room).emit("usersInRoom", getUsersInRoom(room)); // was userRoom  !?  // FIXED also, shouldnt this only be sent to that room?  This seems to broadcast to all rooms and may overwrite their lists
    console.log(name +  " left " + room);
    console.log("users: ",  users);
    console.log("rooms: ",  rooms);
  });

  socket.on("logout", () => {
    let user = getUserById(socket.client.id);
    if (user) {

      if (user.room !== '') {
        socket.to(user.room).emit("send_message", {
          //
          userName: "admin",
          text: `${user.name} has left the room2`,
          time: getTime(),
        });
        let index = getUserIndex(user.name);
        let prevRoom = user.room;
        users[index].room = "";
        io.sockets.in(prevRoom).emit("usersInRoom", getUsersInRoom(prevRoom));
        socket.leave(prevRoom); 
      }
      
      console.log( user.name +  " logged out");
      //deleteUser(socket.client.id); // need some kind of tidy-up here, surely?
      user.isOnline = false;
      console.log("users:", ...users);
      getRooms();
    }
    io.emit("roomInfo", rooms);
    
  });

  socket.on("disconnect", (reason) => {

    console.log('User 1 disconnected because ' + reason);
    io.clients((error, clients) => {
      if (error) throw error;
      console.log(clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
    });
    let user = getUserById(socket.client.id);
    if (user) {
      if (user.room !== '') {
        socket.to(user.room).emit("send_message", {
          //
          userName: "admin",
          text: `${user.name} has left the room`,
          time: getTime(),
        });
        //console.log(getUsersInRoom(user.room));
        let index = getUserIndex(user.name);
        //console.log('Index: ' + index);
        let prevRoom = user.room;
        //users[index].room = "";
        //console.log('userRoom: ' + user.room);
        //console.log('tempRoom: ' + tempRoom);
        //console.log('getUsers: ', getUsersInRoom(user.room));
        io.sockets.in(prevRoom).emit("usersInRoom", getUsersInRoom(prevRoom));
        socket.leave(prevRoom); 
        
      }
      user.isOnline = false;
      //deleteUser(socket.client.id);
    }
    
    getRooms();
    io.emit("roomInfo", rooms);
    console.log("user disconnected" + getTime());
    console.log("users: ",  users);
    console.log("rooms: ",  rooms);
  });

  socket.on("reconnect", () => {
    let user = getUserById(socket.client.id);
    if (user.room !== '') {
      socket.join(user.room);
      socket.to(user.room).emit("send_message", {
          userName: "admin",
          text: `${user.name} has re-joined ${user.room}`,
          time: getTime(),
      });
      socket.emit('rejoin', user.room);

    }
    io.emit("roomInfo", rooms);  
    getRooms();

    console.log(user.name + "reconnected" + getTime());
    console.log("users: ",  users);
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
