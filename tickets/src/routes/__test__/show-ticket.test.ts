import request from 'supertest';
import {app} from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if ticket not found',async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/show-ticket/${id}`)
        .send()
        .expect(404);
});

it('returns a 400 if ticket id is not vaild',async()=>{
    const id = 'isdejfwoeihsdfi';
    await request(app)
        .get(`/api/show-ticket/${id}`)
        .send()
        .expect(400);
})

it('return a ticket if ticket is found', async () => {
    const token = await signin();
    let response = await request(app)
        .post('/api/create-ticket')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'asdfsdf',
            price: 20
        }).expect(201);
    const {title,price,userId,id} = response.body;
    response = await request(app)
        .get(`/api/show-ticket/${id}`)
        .send()
        .expect(200);
    expect(response.body.ticket.title).toEqual(title);
    expect(response.body.ticket.price).toEqual(price);
    expect(response.body.ticket.userId).toEqual(userId);
    expect(response.body.ticket.id).toEqual(id);
});

it('',async () => {

});