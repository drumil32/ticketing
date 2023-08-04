import 'bootstrap/dist/css/bootstrap.css';
import Header from '../components/Header';
import getConfig from "next/config";
import { useCookies } from 'react-cookie';
import { useEffect, useState } from "react";
const { publicRuntimeConfig } = getConfig();
import axios from "axios";
import CookiesProvider from '../Providers/CookieProvider';

const _app = ({ Component, pageProps }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [cookies] = useCookies(["token"]);
    const fun = async () => {
        try {
            const { token } = cookies;
            const response = await axios.get(`${publicRuntimeConfig.AUTH_URL}/api/users/current-user`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            const { currentUser } = response.data;
            setCurrentUser(currentUser);
        } catch (error) {
            setCurrentUser(null);
            console.log(error.message);
        }
    }
    useEffect(() => {
        fun();
    }, [cookies])
    return (
        <CookiesProvider>
            <Header currentUser={currentUser} />
            <Component currentUser={currentUser} {...pageProps} />
        </CookiesProvider>
    )
}

export default _app