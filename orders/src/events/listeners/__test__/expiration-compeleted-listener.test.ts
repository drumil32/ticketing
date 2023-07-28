import { ExpirationCompeletedListener } from "../expiration-compeleted-listener"
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket-schema";
import { Order, OrderStatus } from "../../../models/order-schema";
import mongoose from "mongoose";
import { ExpirationCompeletedEvent } from "@micro_tickets/common";

const setup = async () => {
    const listener = new ExpirationCompeletedListener(natsWrapper.client);
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'first',
        price: 10
    });
    await ticket.save();

    const order = Order.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket: ticket.id
    });
    await order.save();
    // create one order

    const data: ExpirationCompeletedEvent['data'] = {
        orderId: order.id
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, order, ticket, data, msg };
}

it('updates the order status to cancel', async () => {
    const { listener, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
    const { listener, order, data, msg } = await setup();

    await listener.onMessage(data, msg);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const updatedOrder = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[1][1]);
    
    expect(updatedOrder.id).toEqual(order.id);
});

it('ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})