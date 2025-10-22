import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import "./index.css";
import "./i18n";
import { store } from './redux/store/store';
import { Provider } from 'react-redux';
import { CommonProvider } from './context/commonContext';
import { PersistGate } from 'redux-persist/integration/react';
import { SocketProvider, useSocket } from './context/socketContext.jsx';
import { persistStore } from 'redux-persist';

let persistor = persistStore(store);
createRoot(document.getElementById('root')).render(
    <SocketProvider>
        <CommonProvider>
            <Provider store={store}>
                <PersistGate loading={<>Loading...</>} persistor={persistor}>
                    <App />
                </PersistGate>
            </Provider>

        </CommonProvider>
    </SocketProvider>

);
