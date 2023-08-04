import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import useRequest from '../../hooks/use-request';
import getConfig from "next/config";
import { useCookies } from 'react-cookie';
import axios from 'axios';
const { publicRuntimeConfig } = getConfig();

const ShowTicket = () => {
    const router = useRouter();
    const [ticket, setTicket] = useState(null);
    const { ticketId } = router.query;
    const [cookies] = useCookies(["token"]);
    const { token } = cookies;
    const { doRequest, errors } = useRequest({
        url: `${publicRuntimeConfig.ORDERS_URL}/api/create-order`,
        method: 'post',
        body: { ticketId },
        token,
        onSuccess: (order) => {
            Router.push('/orders/[orderId]', `/orders/${order.id}`)
        }
    });
    const getTicket = async () => {
        try {
            const { data: ticket } = await axios.get(`${publicRuntimeConfig.TICKETS_URL}/api/show-ticket/${ticketId}`);
            setTicket(ticket);
        } catch (error) {
            alert(error.response.data.errors);
        }
    }
    useEffect(() => {
        ticketId && getTicket();
    }, [ticketId]);
    return (
        <>
            {
                ticket &&
                <>
                    <h1>{ticket.title}</h1>
                    <h1>Price :- {ticket.price}</h1>
                    {errors}
                    <button className="btn btn-primary" onClick={(e)=>doRequest()}>Purchase</button>
                </>
            }
            {errors}
        </>
    )
}

export default ShowTicket