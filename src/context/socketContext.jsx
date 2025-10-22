import React, { createContext, useContext, useEffect, useState } from 'react';
import socketio from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  // const SOCKET_URL = 'http://localhost:8038';
  const SOCKET_URL = 'http://54.201.160.69:8038';


  useEffect(() => {
    const newSocket = socketio.connect(SOCKET_URL, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected  :', newSocket);
      localStorage.setItem("socketId", newSocket?.id)
      setSocket(newSocket);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setSocket(null);
    });
    window.socketIO = newSocket;
    return () => {
      newSocket.disconnect();
      console.log('Socket disconnected');
    };
  }, [SOCKET_URL]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
