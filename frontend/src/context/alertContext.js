import React, { createContext, useState } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState(null);

    const showAlert = (msg, type, timeout = 5000) => {
        setAlert({ msg, type });

        setTimeout(() => setAlert(null), timeout);
    };

    return (
        <AlertContext.Provider value={{ alert, setAlert: showAlert }}>
            {children}
        </AlertContext.Provider>
    );
};

export default AlertContext;
