import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@micro_tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order-schema";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        console.log(data)
        const order = Order.build({
            id: data.id,
            version: data.version,
            userId: data.userId,
            status: OrderStatus.Created,
            price: data.ticket.price
        });
        await order.save();
        const temp = await Order.find({});
        console.log('checking for all order')
        console.log(temp)

        msg.ack();
    }
    
}