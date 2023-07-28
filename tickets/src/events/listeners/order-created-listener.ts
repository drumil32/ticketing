import { Listener, OrderCreatedEvent, Subjects } from "@micro_tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";
import { Ticket } from "../../models/ticket-schema";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly queueGroupName = queueGroupName;
    readonly subject = Subjects.OrderCreated;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if( !ticket ) {
            throw new Error('Ticket not found');
        }

        ticket.set({orderId:data.id});

        await ticket.save();

        console.log('order created listener here is updated ticket')
        console.log(ticket)

        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            version: ticket.version,
            userId: ticket.userId,
            orderId: ticket.orderId
        });

        msg.ack();
    }
}