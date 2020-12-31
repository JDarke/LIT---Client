const users = [];
const rooms = [];

const getTime = () => {
  let d = new Date();
  return d.toLocaleTimeString().slice(0, -3);
};

const createToken = () => {
  let token = Math.random(1 - 100).toString();
  return token;
};

const addUser = (name, id, room) => {
  // if (!users.find(user => user.name === name)) {
  users.push({ name, id, room, token: createToken(), isOnline: true });
  // }
};

const deleteUser = (id) => {
  console.log("users before delete: ", users);
  let index = users
    .map((user) => {
      return user.id === id;
    })
    .indexOf(true);
  if (index !== -1) {
    users.splice(index, 1);
  }
  console.log("users after delete: ", users);
};

const getRooms = () => {
  rooms.splice(0, rooms.length);
  console.log("getting rooms...");
  users.forEach((user) => {
    if (user.room) {
      console.log("iterating through rooms, at: ", user.room);
      let roomExists = rooms.indexOf(user.room);
      if (roomExists === -1) {
        rooms.push(user.room);
      }
    }
  });
  console.log("returning rooms: ", rooms);
  return rooms;
};

const getUser = (name) => {
  let user = users.find((user) => user.name === name);
  return user;
};

const getUsers = () => {
  return users;
};

const getUserById = (id) => {
  let user = users.find((user) => user.id === id);
  return user;
};

const getUserByToken = (token) => {
  let user = users.find((user) => user.token === token);
  return user;
};

const getUserIndex = (name) => {
  let index = users.findIndex((user) => user.name === name);
  return index;
};

const getUsersInRoom = (room) => {
  let usersInRoom = [];
  users.forEach((user) => {
    if (user.room === room && user.isOnline) {
      usersInRoom.push(user);
    }
  });
  return usersInRoom;
};

module.exports = {
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
};
