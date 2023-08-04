import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import getConfig from "next/config";
import { useCookies } from 'react-cookie';
import axios from 'axios';
// import useRequest from '../../hooks/use-request';
import useRequest from '../../hooks/use-request';
const { publicRuntimeConfig } = getConfig();
import StripeCheckout from 'react-stripe-checkout';

const ShowOrder = ({ currentUser }) => {

    const [timeLeft, setTimeLeft] = useState(0);

    const router = useRouter();
    const [order, setOrder] = useState(null);
    
    const [cookies] = useCookies(["token"]);
    const { token } = cookies;
    const {doRequest,errors} = useRequest({
        url: `${publicRuntimeConfig.PAYMENTS_URL}/api/create-charge`,
        method:'post',
        body:{
            orderId: order?.id
        },
        token,
        onSuccess : (payment)=> {
            Router.push('/orders')
        }
    })
    const { orderId } = router.query;
    const getOrder = async () => {
        try {
            const { data: order } = await axios.get(`${publicRuntimeConfig.ORDERS_URL}/api/show-order/${orderId}`, {
                headers: {
                    authorization: "Bearer " + token,
                }
            });
            setOrder(order);
        } catch (error) {
            alert(error.response.data.errors);
        }
    }

    useEffect(() => {
        orderId && getOrder();
    }, [orderId]);

    const findTimeLeft = () => {
        const timeLeft = new Date(order.expiresAt) - new Date();
        setTimeLeft(Math.round(timeLeft / 1000));
    }

    useEffect(() => {
        let timerId = null;
        if (order) {
            findTimeLeft();
            timerId = setInterval(findTimeLeft, 1000);
        }
        return () => {
            clearInterval(timerId);
        }
    }, [order])

    return (
        <>
            {
                timeLeft < 0 ? <div>Order is expired</div> :
                    order &&
                    <div>
                        Time left to pay: {timeLeft} seconds
                        <StripeCheckout
                            token={({id}) => doRequest({token:id})}
                            stripeKey='pk_test_51NZHhvSFaSA4wycBD8zYUh64ur8l78BshKCxUf6L3nKKTtEzkSExQK1aA3cy6YjYTfGzxE45R3Wz9VNUW9jm7vJz00MkEBbwpK'
                            amount={order.ticket.price * 1000}
                            email={currentUser.email}
                        />
                        {errors}
                    </div>
            }
        </>
    )
}

export default ShowOrder