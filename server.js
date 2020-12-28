const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const translate = require('@k3rn31p4nic/google-translate-api');
const PORT = process.env.PORT || 8080; // was 5000
const path = require('path');
const droom = 'main lounge';
let userRoom = droom;
const getTime = () => {
     let d = new Date();
     return d.toLocaleTimeString().slice(0, -3); 
}

const users = [];
let rooms = [];

const addUser = (name, id, room) => {
     // if (!users.find(user => user.name === name)) {
          users.push({name, id, room})
     // } 
}

const deleteUser = (id) => {
     let index = users.map((user) => {
         return user.id === id
     }).indexOf(true);
     users.splice(index, 1);
}

const getRooms = () => {
     rooms = [];
     users.forEach(user => {
         if (user.room) {
              let roomExists = rooms.indexOf(user.room);
              if (roomExists == -1) {
                   rooms.push(user.room)
              }
         }
     }); 
     return rooms;
}

const getUser = (name) => {
     let user = users.find(user => user.name === name);
     return user;
};

const getUsersInRoom = (room) => {
     let usersInRoom = [];
     users.forEach(user => {
          if (user.room === room) {
               usersInRoom.push(user);
          }
     });
     return usersInRoom;
}

io.on('connection', (socket) => {
     console.log('user connected: ' + socket.client.id);

     socket.on('send_message', (msg) => {
          console.log(msg.userName + ': ' + msg.text);
          let user = getUser(msg.userName);
          if (user) {
               io.sockets.in(user.room).emit('send_message', msg);
          }
     });

     socket.on('typing', (name) => {
          console.log(name + ' is typing...');
          let user = getUser(name);
          if (user) {
               socket.to(user.room).emit('typing', name);
          }
     });

     socket.on('login', (name, nameIsTaken) => {
          let existingUser = getUser(name);
          if (existingUser) {
               nameIsTaken(true);
          } else {
               addUser(name, socket.client.id, '');
               io.to(socket.client.id).emit('roomInfo', rooms ); 
               nameIsTaken(false)
          } 
          console.log(users);
     });

     socket.on('create', ({name, room}, roomNameIsTaken) => {
          let existingRoom = rooms.find(room => room === room) 
          if (existingRoom) {
               roomNameIsTaken(true);
          } else {
               let user = getUser(name);
               if (user) {
                    roomNameIsTaken(false);
                    user.room = room;
                    socket.join(room);
                    io.sockets.in(room).emit('send_message', {
                         userName: 'admin', 
                         text: `${name} created new room - ${room}!`, 
                         time: getTime()
                    });
                    getRooms();
                    socket.broadcast.emit('roomInfo', rooms ); 

                    console.log(users);
                    console.log(rooms);
                    //console.log(io.sockets.adapter.rooms);
               }
          }
       });

     socket.on('join', ({name, room}, roomNotFound) => {
          let existingRoom = rooms.find(room => room === room) 
          if (!existingRoom) {
               roomNotFound(true);
          } else {
               let user = getUser(name);
               if (user) {
                    roomNotFound(false);
                    user.room = room;
                    socket.join(room);
                    socket.broadcast.emit('send_message', {
                         userName: 'admin',
                         text: `${name} has joined ${room}`,
                         time: getTime()
                    });
                    io.to(user.id).emit('send_message', {
                         userName: 'admin',
                         text: `Welcome to ${room}, ${name}!`,
                         time: getTime()
                    });
                    getRooms();
                    
                    console.log(users);
                    console.log(rooms)
               }
          }
     });

     socket.on('leave', ({name, room}) => {
          socket.broadcast.emit('send_message', {
               userName: 'admin', 
               text: `${name} has left the room`, 
               time: getTime()
          });
          let user = getUser(name);
          if (user) {
               user.room = '';
          }
          getRooms();
          socket.broadcast.emit('roomInfo', rooms ); 
          socket.leave(room);

          console.log(users);
          console.log(rooms);
     });

     socket.on('logout', () => {
          deleteUser(socket.client.id); 
          getRooms();

          console.log(users);
     });

     socket.on('disconnect', () => {
          deleteUser(socket.client.id);
          getRooms();

          console.log('user disconnected')
          console.log(users);
     });
});


// app.use(router);
app.use(express.static(path.join(__dirname, 'build')));
//app.use(express.static('C:/Users/UnitA/Projects/LIT/LIT---Client/build/'));

app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname+'/build/index.html'));
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

http.listen(PORT, () => { // was server
    console.log(`Server started on port ${PORT}`)
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