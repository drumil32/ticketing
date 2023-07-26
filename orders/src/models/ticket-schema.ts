import mongoose from "mongoose";
import { Order,OrderStatus } from "./order-schema";

interface TicketAttrs {
    title: string;
    price: number;
}

interface TicketModel extends mongoose.Model<any> {
    build(attrs: TicketAttrs): TicketDoc
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    isReversed() : Promise<boolean>;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required']
    },
    price: {
        type: Number,
        min: 0,
        required: [true, 'price is required']
    }
},{
    toJSON:{
        transform(doc,ret){
            delete ret.__v;
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.statics.build = (attrs:TicketAttrs):TicketDoc=>{
    return new Ticket(attrs);
}
ticketSchema.methods.isReversed = async function(){
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });
    if( existingOrder ) return true;
    else    return false;
}

const Ticket = mongoose.model<TicketDoc,TicketModel>("Ticket",ticketSchema);

export {Ticket};