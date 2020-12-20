import React, { useState, useEffect, useRef } from 'react';
//import { BrowserRouter as Router, Route } from 'react-router-dom';
import io from 'socket.io-client';
import './App.scss';
import ChatWindow from './components/chatWindow/ChatWindow.comp';
import StatusBar from './components/statusBar/StatusBar.comp';
import SignIn from './components/signIn/SignIn.comp';
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
  const [view, setView] = useState("signin");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  

  const login = (chosenName, chosenRoom) => {
    socket.emit("join", { name: chosenName, room: chosenRoom });
    setRoom(chosenRoom);
    setName(chosenName);
    setView('chat');
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

  
  socket.on('joinRoom', (location) => {
    setRoom(location);
  });

  useEffect(() => {
    socket.once('send_message', function(msg) {
      //console.log('receiving msg: ' + msg);
      setMessages([...messages, msg]);
    });
    // socket.once('message', function(msg) {
    //   console.log('received: ' + msg);
    //   const newMessage = createMessage(msg);
    //   setMessages([...messages, newMessage]);
    // });
    if (view === 'chat') {
      scrollToBottom();
    }
  }, [messages, view]);

  return (
    <div className="App">
        <div className="wrapper">
        <StatusBar 
              room={room} 
              name={name} 
              view={view}
            />
        {view === 'signin' && (
            <SignIn
              handleChange={handleChange}
              nameText={nameText}
              roomText={roomText}
              login={login}
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
