import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent, Publisher } from '@micro_tickets/common';
import { Ticket } from "../../models/ticket-schema";
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    readonly queueGroupName = queueGroupName;
    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data;
        console.log(data)
        const ticket = Ticket.build({ title, price, id });
        await ticket.save();
        msg.ack();
    }
}