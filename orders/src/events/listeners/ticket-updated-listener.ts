import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from '@micro_tickets/common';
import { Ticket } from "../../models/ticket-schema";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    readonly queueGroupName = 'order-service';
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {

        const { id, title, price,version } = data;
        const ticket = await Ticket.findByEvent({id,version});
        if (!ticket) {
            throw new Error('ticket not found');
        }
        ticket.title = title;
        ticket.price = price;
        await ticket.save();
        msg.ack();
    }
}