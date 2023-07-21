import React, { useEffect,useContext } from 'react';
import Router from 'next/router';
import { CookiesContext } from '../../Providers/CookieProvider';

const Signout = () => {
    const { removeCookies } = useContext(CookiesContext);
    // const [cookies, setCookies, removeCookies] = useCookies(["token"]);
    
    const logout = () => {
        removeCookies('token', { path: "/" });
    }

    useEffect(() => {
        logout();
        Router.push('/');
    }, []);

    return (
        <div>Signing you out...</div>
    )
}

export default Signout;
