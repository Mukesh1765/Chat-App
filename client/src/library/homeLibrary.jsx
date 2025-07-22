import { createContext, useState } from "react";

export const homeContext = createContext({
    selectedUser: false,
    setSelectedUser: () => {},
});

const HomeContextProvider = ({ children }) => {
    const [selectedUser, setSelectedUser] = useState(false);

    return (
        <>
            <homeContext.Provider value={{ selectedUser, setSelectedUser }}>
                {children}
            </homeContext.Provider>
        </>
    );
};

export default HomeContextProvider;
