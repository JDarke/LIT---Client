import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  withRouter,
  useLocation
} from "react-router-dom";
import io from "socket.io-client";
import "./App.scss";
import ChatWindow from "./components/chatWindow/ChatWindow.comp";
import Header from "./components/header/Header.comp";
import Home from "./components/home/Home.comp";
import SelectRoom from "./components/SelectRoom/SelectRoom.comp";
import Footer from "./components/footer/Footer.comp";
import Menu from "./components/menu/Menu.comp";
// import { useTransition, animated } from "react-spring";
const ENDPOINT = process.env.PORT || "localhost:8080";
const socket = io();

const App = ({ history }) => {
  //const [test, setTest] = useState('test');
  const history2 = useHistory();
  const [typeText, setTypeText] = useState("");
  const [nameText, setNameText] = useState("");
  const [warnNameText, setWarnNameText] = useState("");
  const [warnJoinRoomText, setWarnRoomText] = useState("");
  const [warnCreateRoomText, setWarnCreateRoomText] = useState("");
  const [createRoomText, setCreateRoomText] = useState("");
  const [joinRoomText, setJoinRoomText] = useState("");
  const [typing, setTyping] = useState("");
  const [name, setName] = useState(nameText);
  const [room, setRoom] = useState(joinRoomText);
  const [roomsList, setRoomsList] = useState([]);
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [view, setView] = useState("createRoom");
  const [messages, setMessages] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();
   // if (name === '' && location.pathname !== '/') {
  //   history2.push('/');
  // } 
  useEffect(() => history.listen((location) => {
    let path = location.pathname;
    console.log(path);
    console.log(history2);
    // history2.splice(0, history2.length);

    // if (path === '/rooms') {
    //   history2.push('/', '/rooms')
    //   console.log(history2);
    // }
    // if (name === '') {
    //   history2.push('/');
    // } else if (path === '/rooms') {
    //   leaveRoom();
    // }
  }), [])

  // useEffect(() => {
  //   if (name === '' && location.pathname !== '/') {
  //       history2.push('/');
  //     } 
  // }, [location, name]);

  const login = (chosenName) => {
    if (chosenName) {
      socket.emit("login", chosenName, (nameIsTaken) => {
        if (nameIsTaken) {
          //console.log('Username in use');
          setWarnNameText("Username in use");
        } else {
          setName(chosenName);
          history2.push('/rooms');
          setView("createRoom");
        }
      });
    }
  };

  const useWindowSize = () => {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }

  const [, windowHeight] = useWindowSize();
  

  const logout = () => {
    socket.emit("logout", {});
    setName("");
    history2.push('/');
    setView("home");
  };

  const joinRoom = (chosenRoom) => {
    if (chosenRoom) {
      socket.emit("join", { name: name, userRoom: chosenRoom }, (roomNotFound) => {
        if (roomNotFound) {
          setWarnRoomText("Room does not exist");
        } else {
          setView("chat");
          history2.push('/chat');
          setRoom(chosenRoom); // was ''
        }
      });
    }
  };

  const createRoom = (chosenRoom) => {
    if (chosenRoom) {
      socket.emit(
        "create",
        { name: name, room: chosenRoom },
        (roomNameIsTaken) => {
          if (roomNameIsTaken) {
            setWarnCreateRoomText("Room already exists");
          } else {
            setView("chat");
            history2.push('/chat');
            setRoom(chosenRoom);
          }
        }
      );
    }
  };

  const leaveRoom = (location) => {
    socket.emit("leave", { name, room });
    setView("joinRoom");
    // if (location.pathname !== '/rooms') {
       history2.push('/rooms');
    // } 
    setMessages([]);
    setRoom("");
  };

  const navBack = () => {
    if (view === "chat") {
      leaveRoom();
    } else if (view === "createRoom" || view === "joinRoom") {
      logout();
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleRoomTab = (chosenView) => {
    if (chosenView !== view) {
      setView (chosenView);
    }
  }

  const handleChange = (e, data) => {
    let val = e.target.value;
    switch (data) {
      case "createRoomText":
        setCreateRoomText(val);
        if (warnCreateRoomText !== "") setWarnCreateRoomText("");
        break;

      case "joinRoomText":
        setJoinRoomText(val);
        if (warnJoinRoomText !== "") setWarnRoomText("");
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
    //return {userName: name, text: msg, time: time}
  }

  const sendMessage = (txt) => {
    if (txt) {
      const message = new Message(txt);
      socket.emit("send_message", message);
      setTypeText("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on("roomInfo", (rooms) => {
      setRoomsList(rooms);
    });

    socket.on("usersInRoom", (roomUsers) => {
      setUsersInRoom(roomUsers);
    });

    socket.on("typing", (typingUserName) => {
      setTyping(typingUserName + " is typing...");
      setTimeout(() => {
        setTyping("");
      }, 2000);
    });

    return () => {
      socket.off("roomInfo");
      socket.off("usersInRoom");
      socket.off("typing");
    };
  }, []);

  useEffect(() => {
    socket.once("send_message", function (msg) {
      setMessages([...messages, msg]);
    });
    if (view === "chat") {
      scrollToBottom();
    }
  }, [messages]);

  // const transitions = useTransition(view, (p) => p, {
  //   from: { transform: "translateX(-100%)" },
  //   enter: { transform: "translateX(0)" },
  //   leave: { transform: "translateX(100%)" },
  // });

  return (
    <div className="App" style={{
      height: windowHeight
    }}>
      <div className="wrapper">
        
          <Menu showMenu={showMenu} toggleMenu={toggleMenu} />
          <Header
            room={room}
            name={name}
            view={view}
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
                  handleChange={handleChange}
                  handleRoomTab={handleRoomTab}
                  createRoomText={createRoomText}
                  warnCreateRoomText={warnCreateRoomText}
                  warnJoinRoomText={warnJoinRoomText}
                  joinRoomText={joinRoomText}
                  joinRoom={joinRoom}
                  createRoom={createRoom}
                  roomsList={roomsList}
                />
              </Route>
              <Route path="/chat">
                  <ChatWindow
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
          {view === "chat" && (
            <Footer
              view={view}
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
