import { TicketCreatedEvent } from "@micro_tickets/common";
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListener } from "../ticket-created-listener"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket-schema";

const setup = async () => {
    const listener = new TicketCreatedListener(natsWrapper.client);
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'first',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener,data,msg};
}

it('creates and save a ticket', async () => {
    const {listener,data,msg} = await setup();
    await listener.onMessage(data,msg);

    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket.price).toEqual(data.price);
    expect(ticket.title).toEqual(data.title);
});

it('acks the message',async()=>{
    const {listener,data,msg} = await setup();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
});