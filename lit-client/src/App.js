import React, { useState, useEffect, useRef } from 'react';
//import { BrowserRouter as Router, Route } from 'react-router-dom';
import io from 'socket.io-client';
import './App.scss';
import ChatWindow from './components/chatWindow/ChatWindow.comp';
import Header from './components/header/Header.comp';
import Home from './components/home/Home.comp';
import SelectRoom from './components/SelectRoom/SelectRoom.comp';
import Footer from './components/footer/Footer.comp';
const ENDPOINT = 'localhost:8080';
const socket = io(ENDPOINT);


const App = () => {
  //const [test, setTest] = useState('test');
  const [typeText, setTypeText] = useState("");
  const [nameText, setNameText] = useState("");
  const [roomText, setRoomText] = useState("");
  const [name, setName] = useState(nameText);
  const [room, setRoom] = useState(roomText);
  const [view, setView] = useState("home");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  

  const login = (chosenName) => {
    socket.emit("login", { name: chosenName});
    // setRoom(chosenRoom);
    setName(chosenName);
    setView('selectRoom');
  }

  const handleChange = (e, data) => {
    let val = e.target.value;
    switch(data) {
      case 'roomText':
        setRoomText(val);
      break;

      case 'nameText':
        setNameText(val);
      break;

      case 'typeText':
        setTypeText(val);
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
  // }

  const joinRoom = (chosenRoom) => {
    socket.emit("join", { name: name, room: chosenRoom });
    setView('chat');
    //setMessages([]);
    setRoom('');
  }
  
  const leaveRoom = () => {
    socket.emit('leave', ({name, room}))
    setView('selectRoom');
    //setMessages([]);
    setRoom('');
  }
  
  socket.on('joinRoom', (location) => {
    setRoom(location);
  });

  useEffect(() => {
    socket.once('send_message', function(msg) {
      //console.log('receiving msg: ' + msg);
      setMessages([...messages, msg]);
    });

    if (view === 'chat') {
      scrollToBottom();
    }
  }, [messages, view]);

  return (
    <div className="App">
      <div className="wrapper">
        <Header 
          room={room} 
          name={name} 
          view={view}
          leaveRoom={leaveRoom}
        />
        {view === 'home' && (
          <Home
            handleChange={handleChange}
            nameText={nameText}
            login={login}
          />
        )}
        {view === 'selectRoom' && (
          <SelectRoom
            handleChange={handleChange}
            roomText={roomText}
            joinRoom={joinRoom}
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
            setTypeText={setTypeText}
          />
        )}
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
