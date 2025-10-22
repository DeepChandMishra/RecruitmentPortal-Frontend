import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the CommonContext
const CommonContext = createContext();

// Create the CommonProvider
export const CommonProvider = ({ children }) => {
    const [fileData, setFileData] = useState(null);

    const saveFile = (newFile) => {
        setFileData(newFile);
    };

    // Log fileData whenever it changes
    useEffect(() => {
        if (fileData) {
            console.log('File saved:', fileData);
        }
    }, [fileData]);

    return (
        <CommonContext.Provider value={{ fileData, saveFile }}>
            {children}
        </CommonContext.Provider>
    );
};

// Custom hook to use the CommonContext
export const useCommonContext = () => useContext(CommonContext);
