import { useState,useContext } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { CookiesContext } from '../../Providers/CookieProvider';

const Signup = () => {
  const { setCookies } = useContext(CookiesContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { errors, doRequest } = useRequest({
    url: `${publicRuntimeConfig.AUTH_URL}/api/users/sign-up`,
    method: "post",
    body: { email, password },
    onSuccess: (data) => {
      setCookies('token',data.token,{path:"/"});
      Router.push('/')
    }
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
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
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};

export default Signup;