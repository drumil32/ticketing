import request from 'supertest';
import {app} from '../../app';
import { Ticket } from '../../models/ticket-schema';

it('has a route handler linsting to api/tickets for post request',async()=>{
    const response = await request(app)
        .post('/api/create-ticket')
        .send({});
    expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in',async()=>{
    return request(app)
        .post('/api/create-ticket')
        .send({})
        .expect(401);
});

it('returns status other than 401 if the user is signed in',async() => {
    const token = await signin();
    const response = await request(app)
        .post('/api/create-ticket')
        .set('Authorization', `Bearer ${token}`)
        .send({});
    expect(response.status).not.toEqual(401);
})

it('returns an error if an invalid title is provided',async()=>{
    const token = await signin();
    await request(app)
        .post('/api/create-ticket')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: '',
            price: 10
        }).expect(400);
        await request(app)
        .post('/api/create-ticket')
        .set('Authorization', `Bearer ${token}`)
        .send({
            price: 10
        }).expect(400);
});

it('returns an error if an invalid price is provided',async()=>{
    const token = await signin();
    await request(app)
        .post('/api/create-ticket')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'sdfsf',
            price: -10
        }).expect(400);
        await request(app)
        .post('/api/create-ticket')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'asdfsdf'
        }).expect(400);
});

it('create a ticket with valid parameters',async()=>{
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    const token = await signin();
    const response = await request(app)
        .post('/api/create-ticket')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'asdfsdf',
            price: 20
        }).expect(201);
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
    expect(tickets[0].title).toEqual('asdfsdf');
});