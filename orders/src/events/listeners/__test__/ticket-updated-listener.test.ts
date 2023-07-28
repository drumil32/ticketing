import { TicketUpdatedEvent } from "@micro_tickets/common";
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket-schema";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'first',
        price: 10,
    })
    await ticket.save();
    const listener = new TicketUpdatedListener(natsWrapper.client);
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: ticket.title + '123',
        price: ticket.price + 21,
        version: ticket.version + 1,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket };
}

it('creates and save a ticket', async () => {
    const { listener, data, msg, ticket } = await setup();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket.title).toEqual(data.title);
    expect(updatedTicket.price).toEqual(data.price);
    expect(updatedTicket.version).toEqual(data.version);
});

it('does not call ack if the event has a skipped version number', async () => {
    const { listener, data, msg, ticket } = await setup();
    data.version = data.version + 10;

    try {
        await listener.onMessage(data, msg);
    } catch (err) {
    }
    expect(msg.ack).not.toHaveBeenCalled();
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});