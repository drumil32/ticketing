import mongoose from "mongoose";
import { Order,OrderStatus } from "./order-schema";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
    id: string;
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
    version: number;
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
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.statics.build = (attrs:TicketAttrs):TicketDoc=>{
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
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

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

const Ticket = mongoose.model<TicketDoc,TicketModel>("Ticket",ticketSchema);

export {Ticket};