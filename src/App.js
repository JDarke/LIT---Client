import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Switch,
  Route,
  useHistory,
  withRouter,
  useLocation,
} from "react-router-dom";
import io from "socket.io-client";
import "./App.scss";
import ChatWindow from "./components/chatWindow/ChatWindow.comp";
import Header from "./components/header/Header.comp";
import Home from "./components/home/Home.comp";
import SelectRoom from "./components/SelectRoom/SelectRoom.comp";
import Footer from "./components/footer/Footer.comp";
import Menu from "./components/menu/Menu.comp";
import NotificationModal from "./components/modals/modal.comp";
import NotificationModalWithButton from "./components/modals/modalWithButton.comp";
// import { useTransition, animated } from "react-spring";
const ENDPOINT = process.env.PORT || "localhost:8080";
//const socket = io(ENDPOINT); //x10

const socket = io(/*{
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 30000
}*/); //x10


const colors2 = [
  "#3cb0fd", //DodgerBlue?
  "orange",
  "MediumSeaGreen",
  "yellow",
  "indigo",
  "Tomato",
  "violet",
];

// io.eio.pingTimeout = 100000; // 2 minutes
// io.eio.pingInterval = 30000;

const App = () => {
  const history = useHistory();
  const [typeText, setTypeText] = useState("");
  const [nameText, setNameText] = useState("");
  const [warnNameText, setWarnNameText] = useState("");
  const [warnJoinRoomText, setWarnJoinRoomText] = useState("");
  const [warnCreateRoomText, setWarnCreateRoomText] = useState("");
  const [createRoomText, setCreateRoomText] = useState("");
  const [joinRoomText, setJoinRoomText] = useState("");
  const [typing, setTyping] = useState("");
  const [name, setName] = useState(nameText);
  const [room, setRoom] = useState(joinRoomText);
  const [roomsList, setRoomsList] = useState([]);
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [view, setView] = useState("createRoom");
  const [userColors, setUserColors] = useState({});
  const [litMode, setLitMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const [notification, setNotification] = useState('');
  const [notification2, setNotification2] = useState('');
  const location = useLocation();
  const userToken = () => localStorage.getItem("token");
  const getLocalMessages = () => {
    let m = localStorage.getItem("messages");
    if (!m) {
      m = "[]";
    }
    return JSON.parse(m);
  };
  const setLocalMessages = (j) => {
    let m = JSON.stringify(j);
    localStorage.setItem("messages", m);
  };
  const [messages, setMessages] = useState(getLocalMessages() || []);

  const login = (chosenName) => {
    if (chosenName) {
      let token = localStorage.getItem("token");
      socket.emit("login", chosenName, token, (nameIsTaken) => {
        if (nameIsTaken) {
          setWarnNameText("Username in use");
        } else {
          setName(chosenName);
          setView("createRoom");
          console.log("Logged in. Name: " + chosenName + ". Room: " + room);
        }
      });
    }
  };

  const useWindowSize = () => {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
        if (room) {
          scrollToBottom()
        }
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      
      return () => window.removeEventListener("resize", updateSize);
      
    }, []);
    return size;
  };

  const [, windowHeight] = useWindowSize();

  const logout = () => {
    //put warning check here?
    socket.emit("logout", {});
    setMessages([]);
    setLocalMessages("");
    setRoom('');
    setView('createRoom');
    setWarnJoinRoomText('');
    setWarnCreateRoomText('');
    setCreateRoomText('');
    setJoinRoomText('');
    console.log("Logged out.");
  };

  const joinRoom = (chosenRoom) => {
    if (chosenRoom) {
      socket.emit(
        "join",
        { name: name, userRoom: chosenRoom },
        (roomNotFound) => {
          if (roomNotFound) {
            setWarnJoinRoomText("Room does not exist");
          } else {
            setRoom(chosenRoom); // was ''
            setWarnJoinRoomText("");
            setJoinRoomText("");
            console.log("Join. Name: " + name + ". Room: " + chosenRoom);
          }
        }
      );
    }
  };

  const createRoom = (chosenRoom) => {
    if (chosenRoom) {
      socket.emit(
        "create",
        { name: name, userRoom: chosenRoom },
        (roomNameIsTaken) => {
          if (roomNameIsTaken) {
            setWarnCreateRoomText("Room already exists");
          } else {
            setRoom(chosenRoom);
            setWarnCreateRoomText("");
            setCreateRoomText("");
            console.log("Create room. Name: " + name + ". Room: " + chosenRoom);
          }
        }
      );
    }
  };

  const leaveRoom = () => {
    socket.emit("leave", { name, room });
    console.log("Leave room. Name: " + name + ". Room: " + room);
    setWarnJoinRoomText('');
    setWarnCreateRoomText('');
    setCreateRoomText('');
    setJoinRoomText('');
    setView("joinRoom");
    console.log('view should be joinRoom: ', view)
  };

  const navBack = () => {
    if (location.pathname === "/chat") {
      leaveRoom();
      setRoom('');
    } else if (location.pathname === "/rooms") {
      
      warnBeforeLogout();
      //logout();
      //setName('');   // ***
    }
  };

  const toggleMenu = () => {
    //abstract these two into a toggle function for all boolean useStates
    setShowMenu(!showMenu);
  };

  const toggleLitMode = () => {
    console.log(!litMode, name, room);
    socket.emit("lit-mode", !litMode, name, room);
    setLitMode(!litMode);
  };

  const handleRoomTab = (chosenView) => {
    if (chosenView !== view) {
      setView(chosenView);
    }
  };

  const handleChange = (e, data) => {
    let val = e.target.value;
    switch (data) {
      case "createRoomText":
        setCreateRoomText(val);
        if (warnCreateRoomText !== "") setWarnCreateRoomText("");
        break;

      case "joinRoomText":
        setJoinRoomText(val);
        if (warnJoinRoomText !== "") setWarnJoinRoomText("");
        break;

      case "nameText":
        setNameText(val);
        if (warnNameText !== "") setWarnNameText("");
        break;

      case "typeText":
        setTypeText(val);
        socket.emit("typing", name);
        break;

      default:
        return;
    }
  };

  const getTime = () => {
    let d = new Date();
    return d.toLocaleTimeString().slice(0, -3);
  };

  function Message(text) {
    this.userName = name;
    this.text = text;
    this.time = getTime();
    this.lit = litMode;
    this.room = room;
    //return {userName: name, text: msg, time: time}
  }

  const sendMessage = (txt) => {
    if (txt) {
      const message = new Message(txt);
      socket.emit("send_message", message);
      console.log(
        "Msgsent. Name: " + name + ". Room: " + room + ". Msg: ",
        message
      );
      setTypeText("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, 300)
  };

  const getUserColor = () => {
    let userColor = colors2.shift();
    console.log("shift");
    colors2.push(userColor);
    console.log("usrColor", userColor);
    return userColor;
  };

  const handleCloseNotificationModal = () => {
    setNotification2(null);
  };

  const warnBeforeLogout = () => {
    setNotification2('Confirm Logout?');
  }

  useEffect(
    () =>
      history.listen((newLocation, action) => {
        let path = location.pathname;
        let newPath = newLocation.pathname;
        console.log(path);
        console.log(newPath);

        if (path === '/' && newPath === '/rooms') {
          setView('createRoom');
        }
        if (action === "POP") {
          if (path === '/chat') {
            setRoom('');
          }
          if (path === '/rooms') {
            //warnBeforeLogout();
            //history.go(1);
            setName(''); // ***
          }
          if (path === '/') {
            history.go(1);
          }
        }
      }),
    [location, history]
  );

  useEffect(() => {    //  routes user based on name and room being set or not.
    let path = location.pathname;
    if (name && room) {
      if (path !== "/chat") {
        history.push("/chat");
      }
    } else if (name) {
      if (path !== "/rooms") {
        history.push("/rooms");
      } 
    } else if (path !== "/") {
        history.push("/");
    }
  }, [name, room]);

  useEffect(() => {  //  Handles state tidy up in case of ending up on a path without the correct relvant state (name, room).
    console.log('location useEffect')
    if (location.pathname === "/rooms") {
      if (view !== 'joinRoom' && view !== 'createRoom') {
        setView('createRoom');
      }
      if (room) {
        setRoom('');
        leaveRoom();
      }
    } else if (location.pathname === '/') {
      
      if (room) setRoom('');
      if (name) setName(''); // ***
      logout();
    }
  }, [location.pathname]);

  useEffect(() => {
    window.onbeforeunload = confirmExit;
    function confirmExit() {
      return "show warning";
    }
  }, []);


  const clearDeadMessages = () => {
    const clearedMessages = messages.filter((msg) => {
      console.log('filter - room: ' + msg.room + ', i: ' + roomsList.indexOf(msg.room));
      return (roomsList.indexOf(msg.room) > -1);
    });
    setMessages(clearedMessages);
  };

  useEffect(() => {
    clearDeadMessages();
    console.log(messages);
  }, [roomsList]);

  useEffect(() => {
    socket.on("token", (token) => {
      localStorage.setItem("token", token);
      console.log("receive token: ", token);
      console.log("userToken: ", userToken());
    });

    socket.on("roomInfo", (rooms) => {
      setRoomsList(rooms);
      console.log("receive roominfo: ", rooms);
    });

    socket.on("usersInRoom", (roomUsers, room) => {
      setUsersInRoom(roomUsers);
      console.log("receive usersinroom info: ", roomUsers);
    });

    socket.on("typing", (typingUserName) => {
      setTyping(typingUserName + " is typing...");
      setTimeout(() => {
        setTyping("");
      }, 2000);
    });

    socket.on("disconnect", function (reason) {
      console.log("User disconnected because " + reason);
    });

    socket.on("reconnect", function () {
      setNotification('Reconnecting...');
      console.log("Reconnecting");
    });

    socket.on("connect", function () {
      console.log("Connect. Name: " + name + ". Room: " + room);
      console.log(userToken());
      setNotification('');
      socket.emit(
        "retrieveUser",
        userToken(),
        function retrieveUser({ name, room }) {
          setName(name);
          setRoom(room);
          var b = getLocalMessages();
          console.log("b: ", b);
          setMessages(b);
          console.log("retrieved user name and room: " + name + ", " + room);
        }
      );
    });

    socket.on("logout", function () {
      setName(''); 
      setRoom('');
    });

    return () => {
      socket.off("token");
      socket.off("roomInfo");
      socket.off("usersInRoom");
      socket.off("typing");
      socket.off("disconnect");
      socket.off("reconnect");
      socket.off("connect");
      socket.off("logout");
    };
  }, []);

  useEffect(() => {
    socket.once("send_message", function (msg) {
      setMessages([...messages, msg]);
      setLocalMessages([...messages, msg]);
    });
    console.log(messages);
  }, [messages]);  // do messages get received while in the lobby?

  useEffect(() => {
    if (location.pathname === "/chat") {
      scrollToBottom();
    }
  }, [messages, location]);

  useEffect(() => {
    console.log("update user color info: ", userColors);
  }, [userColors]);

  useEffect(() => {
    usersInRoom.forEach((user) => {
      if (user.name !== name) {
        //let index;
        let color;
        if (!userColors[user.name]) {
          color = getUserColor();
          setUserColors((prevState) => ({
            ...prevState,
            [user.name]: color,
          }));
        }
      }
    });
  }, [usersInRoom, name, userColors]);

  const handleClickRoom = (txt) => {
    setJoinRoomText(txt);
    if (warnJoinRoomText !== "") setWarnJoinRoomText("");
  };

  const logoutFromModal = () => {
    setNotification2(null);
    setName('');
  };
  // const transitions = useTransition(view, (p) => p, {
  //   from: { transform: "translateX(-100%)" },
  //   enter: { transform: "translateX(0)" },
  //   leave: { transform: "translateX(100%)" },
  // });

  return (
    <div
      className="App"
      style={{
        height: windowHeight,
      }}
    >
      <div className="wrapper">
        <Menu
          showMenu={showMenu}
          toggleMenu={toggleMenu}
          litMode={litMode}
          toggleLitMode={toggleLitMode}
        />
        {notification && (
          <NotificationModal
            notification={notification}
            //handleCloseNotificationModal={handleCloseNotificationModal}
          />
        )}
        {notification2 && (
          <NotificationModalWithButton
            notification={notification2}
            logoutFromModal={logoutFromModal}
            handleCloseNotificationModal={handleCloseNotificationModal}
          />
        )}
        <Header
          location={location}
          room={room}
          name={name}
          path={location.pathname}
          typing={typing}
          usersInRoom={usersInRoom}
          navBack={navBack}
          toggleMenu={toggleMenu}
        />
        <div className="innerWrapper">
          <Switch>
            <Route exact path="/">
              <Home
                handleChange={handleChange}
                nameText={nameText}
                warnNameText={warnNameText}
                login={login}
              />
            </Route>
            <Route path="/rooms">
              <SelectRoom
                view={view}
                name={name}
                handleChange={handleChange}
                handleRoomTab={handleRoomTab}
                createRoomText={createRoomText}
                warnCreateRoomText={warnCreateRoomText}
                warnJoinRoomText={warnJoinRoomText}
                joinRoomText={joinRoomText}
                handleClickRoom={handleClickRoom}
                joinRoom={joinRoom}
                createRoom={createRoom}
                roomsList={roomsList}
              />
            </Route>
            <Route path="/chat">
              <ChatWindow
                room={room}
                userColors={userColors}
                messages={messages}
                messagesEndRef={messagesEndRef}
                typeText={typeText}
                handleChange={handleChange}
                sendMessage={sendMessage}
                name={name}
                typing={typing}
                setTypeText={setTypeText}
              />
            </Route>
          </Switch>
        </div>
        {location.pathname === "/chat" && (
          <Footer
            location={location}
            typeText={typeText}
            handleChange={handleChange}
            sendMessage={sendMessage}
          />
        )}
      </div>
    </div>
  );
};

export default withRouter(App);
