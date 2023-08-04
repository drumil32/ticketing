import axios from 'axios';
import React, { useEffect, useState } from 'react'
import getConfig from "next/config";
import { useCookies } from 'react-cookie';
const { publicRuntimeConfig } = getConfig();

const ShowAllOrders = ({ currentUser }) => {
    const [orderList, setOrderList] = useState(null);

    const [cookies] = useCookies(["token"]);
    const { token } = cookies;
    const getOrderList = async () => {
        try {
            const {data:orderList} = await axios.get(`${publicRuntimeConfig.ORDERS_URL}/api/show-all-order`, {
                headers: {
                    authorization: "Bearer " + token,
                }
            });
            console.log(orderList)
            console.log(typeof orderList)
            setOrderList(orderList);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        currentUser && getOrderList();
    }, [])
    return (
        <div>
            {
                orderList?.map(order =>
                    <li key={order.id}>
                        {order.ticket.title} - {order.status}
                    </li>
                )
            }
        </div>
    )
}

export default ShowAllOrders