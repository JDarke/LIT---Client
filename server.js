const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 8080; 
const path = require("path");
const fetch = require("node-fetch");
const { getTime } = require('./backend/utils')

io.eio.pingTimeout = 10000; // x10
io.eio.pingInterval = 30000; 


io.on("connection", (socket) => {
  console.log("user connected: " + socket.client.id + " " + getTime());
  io.clients((error, clients) => {
    if (error) throw error;
    console.log(clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
  });
  //getRooms();

  require("./backend/sockets").listen(io, socket);

// TO FIX:  A created room on the pc didnt appear on my phone app list, and when I created a room with the same name, it joined to the room.  it allowed create action, but actually joined.  Need to update room info better/sooner, and trace the create/join overlap.

  
});


app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

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




// Make one "update data" function/source?  It can send only the changed info, but should be a single function.

// currently not destroying actual socket rooms, so re creating with same name room actually joins an existing one.  This should have tidy up actions when rooms array is modified.

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
