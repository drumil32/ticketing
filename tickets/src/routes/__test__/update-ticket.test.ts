import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

const createTicket = async (title: string, price: number, email: string, userId: string) => {
    const token = await signin(email, userId);
    return request(app)
        .post('/api/create-ticket')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title,
            price
        });
}

it('return 401 if user is not authenticated in', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .put(`/api/update-ticket/${id}`)
        .send({
            title: 'first',
            price: 10
        })
        .expect(401);
    console.log(response.body);
});

it('returns 401 if user is not authorized to update the ticket', async () => {
    // with this we created ticket which is own by abc@g.com
    let response = await createTicket('first', 10, 'abc@g.com', new mongoose.Types.ObjectId().toHexString());
    console.log(response.body.ticket.id);
    let id = response.body.ticket.id;

    // now we try to update that ticket with user def@g.com
    const token = await signin('def@g.com', new mongoose.Types.ObjectId().toHexString());
    response = await request(app)
        .put(`/api/update-ticket/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'first',
            price: 10
        })
        .expect(401);
});

it('returns a 400 if ticket id is not vaild', async () => {
    const id = 'isdejfwoeihsdfi';
    const token = await signin("abc34@g.com", new mongoose.Types.ObjectId().toHexString());
    return request(app)
        .put(`/api/update-ticket/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'first',
            price: 10
        })
        .expect(400);
});

it('returns a 404 if provided id is not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const token = await signin("abc34@g.com", new mongoose.Types.ObjectId().toHexString());
    await request(app)
        .put(`/api/update-ticket/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'first',
            price: 10
        })
        .expect(404);
});

it('returns 400 if the user provides an invalid title or price', async () => {
    const token = await signin("abc@g.com", new mongoose.Types.ObjectId().toHexString());
    let response = await request(app)
        .post('/api/create-ticket')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'first',
            price: 10
        });
    console.log(response.body);
    const ticketId = response.body.id;
    response = await request(app)
        .put(`/api/update-ticket/${ticketId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: '',
            price: 10
        }).expect(400);

    response = await request(app)
        .put(`/api/update-ticket/${ticketId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: '',
            price: 10
        }).expect(400);
});

it('returns 200 if the user provides valid inputs and ticket updated', async () => {
    const token = await signin("abc@g.com", new mongoose.Types.ObjectId().toHexString());
    let response = await request(app)
        .post('/api/create-ticket')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'first',
            price: 10
        });
    console.log(response.body);
    const ticketId = response.body.ticket.id;
    response = await request(app)
        .put(`/api/update-ticket/${ticketId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'second',
            price: 20
        }).expect(200);
    console.log(response.body);
    expect(response.body.ticket.title).toEqual('second');
    expect(response.body.ticket.price).toEqual(20);
});

it('publishes an event', async () => {
    const token = await signin("abc@g.com", new mongoose.Types.ObjectId().toHexString());
    let response = await request(app)
        .post('/api/create-ticket')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'first',
            price: 10
        });
    const ticketId = response.body.ticket.id;
    response = await request(app)
        .put(`/api/update-ticket/${ticketId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'second',
            price: 20
        }).expect(200);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})