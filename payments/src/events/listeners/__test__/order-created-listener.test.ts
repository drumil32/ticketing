import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import { OrderCreatedEvent, OrderStatus } from "@micro_tickets/common";
import { Order } from "../../../models/order-schema";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: "sdfwef",
        version: 0,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 120
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
}

it('replicates the order info', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);

});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})