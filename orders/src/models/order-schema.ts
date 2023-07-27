import mongoose from "mongoose";
import { OrderStatus } from '@micro_tickets/common';
import { TicketDoc } from "./ticket-schema";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export { OrderStatus };

interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<any> {
    build(attrs: OrderAttrs): OrderDoc
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    version: number;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'userId is required']
    },
    status: {
        type: String,
        required: [true, 'status is required'],
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.statics.build = (attrs: OrderAttrs): OrderDoc => {
    return new Order(attrs);
}

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };