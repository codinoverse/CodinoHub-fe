import {  useState } from "react";


export const StateContext = createContext();

export const StateProvider = ({ Children }) => {
    const [users, setUsers] = useState([]);


    return(
        <>
        <StateContext.Provider value={{users, setUsers}}>
               {Children}
        </StateContext.Provider>
        </>
    );
};
