import useRequest from '../../hooks/use-request';
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import Router from 'next/router';
import { useState } from 'react';
import { useCookies } from 'react-cookie';

const CreateTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [cookies] = useCookies(["token"]);
  const { token } = cookies;
  const { doRequest, errors } = useRequest({
    url: `${publicRuntimeConfig.TICKETS_URL}/api/create-ticket`,
    method: 'post',
    body: {
      title,
      price,
    },
    token,
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default CreateTicket