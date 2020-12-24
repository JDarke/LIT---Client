import React, { useState, useEffect, useRef } from 'react';
//import { BrowserRouter as Router, Route } from 'react-router-dom';
import io from 'socket.io-client';
import './App.scss';
import ChatWindow from './components/chatWindow/ChatWindow.comp';
import Header from './components/header/Header.comp';
import Home from './components/home/Home.comp';
import SelectRoom from './components/SelectRoom/SelectRoom.comp';
import Footer from './components/footer/Footer.comp';
import Menu from './components/menu/Menu.comp'
const ENDPOINT = 'localhost:8080';
const socket = io(ENDPOINT);


const App = () => {
  //const [test, setTest] = useState('test');
  const [typeText, setTypeText] = useState("");
  const [nameText, setNameText] = useState("");
  const [warnText, setWarnText] = useState("");
  const [warnRoomText, setWarnRoomText] = useState("");
  const [warnCreateRoomText, setWarnCreateRoomText] = useState("");
  const [createRoomText, setCreateRoomText] = useState("");
  const [joinRoomText, setJoinRoomText] = useState("");
  const [typing, setTyping] = useState("");
  const [name, setName] = useState(nameText);
  const [room, setRoom] = useState(joinRoomText);
  const [roomsList, setRoomsList] = useState([]);
  const [view, setView] = useState("home");
  const [messages, setMessages] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);
  

  const login = (chosenName) => {
    if (chosenName) {
      socket.emit("login", chosenName, (nameIsTaken) => {
        if (nameIsTaken) {
          //console.log('Username in use');
          setWarnText('Username in use');
        } else {
          setName(chosenName);
          setView('selectRoom');
        }
      });
    }
  }

  const logout = () => {
    socket.emit("logout", {});
    setName('');
    setView('home');
  }

  const joinRoom = (chosenRoom) => {
    if (chosenRoom) {
      socket.emit("join", { name: name, room: chosenRoom }, (roomNotFound) => {
        if (roomNotFound) {
          setWarnRoomText('Room does not exist');
        } else {
          setView('chat');
          setRoom(chosenRoom); // was ''
        }
      });
      
    }
  }
  
  const createRoom = (chosenRoom) => {
    if (chosenRoom) {
      socket.emit("create", { name: name, room: chosenRoom }, (roomNameIsTaken) => {
        if (roomNameIsTaken) {
          setWarnCreateRoomText('Room already exists');
        } else {
          setView('chat');
          setRoom(chosenRoom);
        }
      });
      
    }
  }

  const leaveRoom = () => {
    socket.emit('leave', ({name, room}))
    setView('selectRoom');
    setMessages([]);
    setRoom('');
  }
  
  const navBack = () => {
    if (view === 'chat') {
      leaveRoom();
    } else if (view === 'selectRoom') {
      logout();
    }
  }

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  }

  const handleChange = (e, data) => {
    let val = e.target.value;
    switch(data) {
      case 'createRoomText':
        setCreateRoomText(val);
      break;

      case 'joinRoomText':
        setJoinRoomText(val);
      break;

      case 'nameText':
        setNameText(val);
      break;

      case 'typeText':
        setTypeText(val);
        socket.emit('typing', name);
      break;
      
      default:
        return;
    }
  } 

  const getTime = () => {
    let d = new Date();
    return d.toLocaleTimeString().slice(0, -3); 
  }

  function Message(text)  {
      this.userName = name;
      this.text = text;
      this.time = getTime();
      //return {userName: name, text: msg, time: time}
  } 
    
  const sendMessage = (txt) => {
    if (txt) {
      const message = new Message(txt);
      socket.emit('send_message', message);
      setTypeText('');
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  // const clearMessages = () => {
  //   setMessages([]);
  //}
  
  // socket.on('joinRoom', (location) => {
  //   setRoom(location);
  // });

  socket.on('roomInfo', (rooms) => {
    setRoomsList(rooms);
  });

  socket.on('typing', (typingUserName) => {
    //if (typingUserName !== name) {
      setTyping(typingUserName + ' is typing...');
      setTimeout(() => {
        setTyping('');
      }, 2000);
    //}
    
  });

  useEffect(() => {
    socket.once('send_message', function(msg) {
      setMessages([...messages, msg]);
    });
    if (view === 'chat') {
      scrollToBottom();
    }
  }, [messages, view]);
  
  useEffect(() => {
    setWarnRoomText('');
  }, [joinRoomText]);

  useEffect(() => {
    setWarnCreateRoomText('');
  }, [createRoomText]);

  useEffect(() => {
    setWarnText('');
  }, [nameText]);

  return (
    <div className="App">
      <div className="wrapper">
        <Header 
          room={room} 
          name={name} 
          view={view}
          typing={typing}
          navBack={navBack}
          toggleMenu={toggleMenu}
        />
        <div className="innerWrapper">
          {showMenu && (
            <Menu />
          )}
          {view === 'home' && (
            <Home
              handleChange={handleChange}
              nameText={nameText}
              warnText={warnText}
              login={login}
            />
          )}
          {view === 'selectRoom' && (
            <SelectRoom
              handleChange={handleChange}
              createRoomText={createRoomText}
              warnCreateRoomText={warnCreateRoomText}
              warnRoomText={warnRoomText}
              joinRoomText={joinRoomText}
              joinRoom={joinRoom}
              createRoom={createRoom}
              roomsList={roomsList}
            />
          )}
          {view === 'chat' && (
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
          )} 
        </div>
        <Footer 
          view={view} 
          typeText={typeText}
          handleChange={handleChange}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}

export default App;
