import React from 'react';
import { useCookies } from 'react-cookie';

export const CookiesContext = React.createContext();


function CookiesProvider({ children }) {
    const [cookies, setCookies, removeCookies] = useCookies(["token"]);

    const handleSetCookies = (key, data) => {
        setCookies(`${key}`, data, { path: "/" });
    };
    const handleRemoveCookies = (key) => {
        removeCookies(`${key}`, { path: "/" });
    };

    return (
        <CookiesContext.Provider value={{ cookies, removeCookies: handleRemoveCookies, setCookies: handleSetCookies }} >
            {children}
        </CookiesContext.Provider>
    )
}

export default CookiesProvider;