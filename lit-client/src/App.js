import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.scss';

const ENDPOINT = 'localhost:8080';
const socket = io(ENDPOINT);

const App = () => {
  //const [test, setTest] = useState('test');
  const [text, setText] = useState('text');
  const [messages, setMessages] = useState([]);
      
  useEffect(() => {
    socket.on('send_message', function(msg) {
      console.log('receiving msg: ' + msg)
    });
  }, [messages]);

  // socket.on('connect', function(data) {
  //   //console.log(socket.client.id);
  //   //socket.emit('join', 'New user has joined');
  // });
  
  socket.on('reply', function(msg) {
    console.log('received: ' + msg)
    const newMessage = <li className="message">{msg}</li>;
    setMessages([...messages, newMessage]);
  });

  const handleChange = (e) => {
    let change = e.target.value
    setText(change);
    //console.log(change)
  } 

  const sendMessage = (msg) => {
    if (msg) {
      console.log('send');
      //setText(msg);
      const newMessage = <li className="message">{msg}</li>;
      setMessages([...messages, newMessage]);

      socket.emit('send_message', msg);
      setText('');
    }
    
  }

  return (
    <div className="App">
      <div className="wrapper">
        <div className="statusBar">
          <h2>Lost In Translation</h2>
        </div>
        <ul id="messages">{messages}</ul>
        <form className="messageForm" action="" onSubmit={(e) => e.preventDefault()}>
          <input id="m" autoComplete="off" value={text} onChange={(e) => handleChange(e)} />
          <button onClick={()=>sendMessage(text)}>Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
