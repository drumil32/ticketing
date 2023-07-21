import { useState,useContext } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { CookiesContext } from '../../Providers/CookieProvider';

const SignIn = () => {
    const { setCookies } = useContext(CookiesContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { errors, doRequest } = useRequest({
        url: `${publicRuntimeConfig.AUTH_URL}/api/users/sign-in`,
        method: "post",
        body: { email, password },
        onSuccess: (data) => {
            console.log(data)
            setCookies('token', data.token, { path: "/" });
            Router.push('/')
        }
    });
    const onSubmit = async (event) => {
        console.log('ok signin request is sended')
        console.log(email,'   ',password)
        event.preventDefault();
        await doRequest();
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>SignIn</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    className="form-control"
                />
            </div>
            {errors}
            <button className="btn btn-primary">SignIn</button>
        </form>
    );
};

export default SignIn;