/*************************** REACT IMPORTS ***************************/
import React from 'react';
import ReactDOM from 'react-dom';


/*************************** COMPONENT IMPORTS ***************************/
import { Provider } from 'react-redux';
import App from './App';
import configureStore from './store';
import ModalProvider from './context/Modal';
import SearchProvider from './context/Search';
import FirstLoadProvider from './context/FirstLoad';


/*************************** CSS ***************************/
import './index.css';


/*************************** COMPONENTS ***************************/
const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <ModalProvider>
      <FirstLoadProvider>
        <SearchProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </SearchProvider>
      </FirstLoadProvider>
    </ModalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
