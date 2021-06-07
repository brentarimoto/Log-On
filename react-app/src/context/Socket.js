/*************************** REACT IMPORTS ***************************/
import React from "react";
import { createContext, useContext, useState } from "react";
import { io } from "socket.io-client";

/*************************** CONTEXT ***************************/
export const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

let socket;
/*************************** PROVIDER ***************************/

export const SocketProvider = (props) => {

  const [socket, setSocket] = useState(io());

  return (
    <SocketContext.Provider
      value={{ socket}}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

/*************************** EXPORT ***************************/
export default SocketProvider;
