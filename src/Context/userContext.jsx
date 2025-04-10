import React, { createContext, useState, useContext } from "react";

// Create context for user data
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);

    // Method to set user data
    const setUser = (data) => {
        setUserData(data); // Set the user data in context
    };

    return (
        <UserContext.Provider value={{ userData, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to access user context
export const useUser = () => {
    return useContext(UserContext);
};
