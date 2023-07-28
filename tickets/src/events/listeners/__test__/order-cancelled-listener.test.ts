import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket-schema";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledEvent } from "@micro_tickets/common";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: "first",
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString()
    });
    ticket.set({orderId});
    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 1, // doesn't matter
        ticket: {
            id: ticket.id,
        }
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener,ticket,data,msg};
}

it('remove the orderId of the ticket',async()=>{
    const {listener,ticket,data,msg} = await setup();

    await listener.onMessage(data,msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket.orderId).not.toBeDefined();

});

it('acks the message',async()=>{
    const {listener,ticket,data,msg} = await setup();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event',async () => {
    const {listener,ticket,data,msg} = await setup();

    await listener.onMessage(data,msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    // @ts-ignore
    // console.log(natsWrapper.client.publish.mock.calls);

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(ticketUpdatedData.orderId).not.toBeDefined();
})