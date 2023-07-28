import { ExpirationCompeletedEvent, Listener, OrderStatus, Subjects } from "@micro_tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order-schema";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompeletedListener extends Listener<ExpirationCompeletedEvent> {
    readonly subject = Subjects.ExpirationCompleted;
    readonly queueGroupName = queueGroupName;
    async onMessage(data: ExpirationCompeletedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error('order not found');
        }

        if (order.status === OrderStatus.Created) {

        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            ticket: {
                id: order.ticket
            },
            version: order.version
        });
        msg.ack();
    }

}