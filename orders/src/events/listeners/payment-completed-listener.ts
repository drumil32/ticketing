import { Listener, OrderStatus, PaymentCompeletedEvent, Subjects } from "@micro_tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order-schema";

export class PaymentCompeletedListener extends Listener<PaymentCompeletedEvent>{
    readonly subject = Subjects.PaymentCompleted;
    readonly queueGroupName = queueGroupName;
    async onMessage(data: PaymentCompeletedEvent['data'], msg: Message){
        const order = await Order.findById(data.orderId)
        if( !order ){
            throw new Error('order is not found');
        }
        order.set({status:OrderStatus.Complete});
        await order.save();
        msg.ack();
    }

}