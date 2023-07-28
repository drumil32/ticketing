import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket-schema';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order-schema';
import { natsWrapper } from '../../nats-wrapper';

// ticket is already reversed
// sucesfully reverse the ticket

it("return 401 if the use is not authorized", async () => {
    const ticketId = new mongoose.Types.ObjectId(); // assume this ticketId is exists in the database
    return request(app)
        .post('/api/create-order')
        .send({
            ticketId
        })
        .expect(401);
})

it("returns 400 if input is not valid", async () => {
    const token = await signin('abc@g.com', '123321');
    await request(app)
        .post('/api/create-order')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);
    return request(app)
        .post('/api/create-order')
        .set('Authorization', `Bearer ${token}`)
        .send({ticketId:'123sdiofjef'})
        .expect(400)
});

it("returns 404 if the ticket does not exist", async () => {
    const token = await signin('abc@g.com', '123321');
    const ticketId = new mongoose.Types.ObjectId();
    return request(app)
        .post('/api/create-order')
        .set('Authorization', `Bearer ${token}`)
        .send({
            ticketId
        })
        .expect(404);
});

it('returns 400 if ticket is already reversed',async()=>{
    const ticket = await Ticket.build({title:'first',price:20,id: new mongoose.Types.ObjectId().toHexString()}).save();
    const userId = new mongoose.Types.ObjectId().toString();
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + Number(process.env.EXPIRATION_WINDOW_SECONDS));

    const order = await Order.build({
        userId,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    }).save();
    const token = await signin('drumil@gm.com','123321');
    return request(app)
        .post('/api/create-order')
        .set('Authorization', `Bearer ${token}`)
        .send({
            ticketId:ticket.id
        })
        .expect(400);
});


it('returns 201 if ticket is successfully reversed',async()=>{
    const ticket = await Ticket.build({title:'first',price:20,id: new mongoose.Types.ObjectId().toHexString()}).save();

    const token = await signin('drumil@gm.com','123321');
    return request(app)
        .post('/api/create-order')
        .set('Authorization', `Bearer ${token}`)
        .send({
            ticketId:ticket.id
        })
        .expect(201);
});
it.todo('in above test you need to check in db as well YOU KNOW THE REASON FOR THIS RIGHT OR REFERE KEEP NOTE');

it('emits an order created event',async()=>{
    const ticket = await Ticket.build({title:'first',price:20,id: new mongoose.Types.ObjectId().toHexString()}).save();

    const token = await signin('drumil@gm.com','123321');
    await request(app)
        .post('/api/create-order')
        .set('Authorization', `Bearer ${token}`)
        .send({
            ticketId:ticket.id
        })
        .expect(201);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
