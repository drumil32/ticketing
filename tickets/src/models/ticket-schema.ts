import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

interface TicketModel extends mongoose.Model<any> {
    build(attrs: TicketAttrs): TicketDoc
}

interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    createAt: string;
    version: number;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required']
    },
    price: {
        type: Number,
        required: [true, 'price is required']
    },
    userId: {
        type: String,
        required: [true, 'userId is required']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            // delete ret.__v;
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs): TicketDoc => {
    return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };