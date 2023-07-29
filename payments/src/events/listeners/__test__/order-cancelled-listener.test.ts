import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { OrderCancelledEvent, OrderStatus } from "@micro_tickets/common";
import { Order } from "../../../models/order-schema";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: orderId,
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10
    });
    await order.save();
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 1,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, order, data, msg };
}

it('updates the status of the order', async () => {
    const { listener, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})