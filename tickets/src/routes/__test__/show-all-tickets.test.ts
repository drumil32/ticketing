import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

const createTicket = async (title: string, price: number) => {
    const token = await signin("abc34@g.com",new mongoose.Types.ObjectId().toHexString());
    return request(app)
        .post('/api/create-ticket')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title,
            price
        });
}

it('can fatch all tickets', async () => {
    await createTicket('first', 10);
    await createTicket('second',20);
    await createTicket('third',30);

    const response = await request(app)
        .get('/api/show-all-tickets')
        .send()
        .expect(200);
    expect(response.body.length).toEqual(3);
});