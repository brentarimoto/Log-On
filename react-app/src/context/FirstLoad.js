/*************************** REACT IMPORTS ***************************/
import React from "react";
import { createContext, useContext, useState } from "react";

/*************************** CONTEXT ***************************/
export const FirstLoadContext = createContext();
export const useFirstLoad = () => useContext(FirstLoadContext);

let socket;
/*************************** PROVIDER ***************************/

export const FirstLoadProvider = (props) => {

  const [firstLoad, setFirstLoad] = useState(true);

  return (
    <FirstLoadContext.Provider
      value={{ firstLoad, setFirstLoad }}
    >
      {props.children}
    </FirstLoadContext.Provider>
  );
};

/*************************** EXPORT ***************************/
export default FirstLoadProvider;
