import request from 'supertest';
import {app} from '../../app';

it('has a route handler linsting to api/tickets for post request',async()=>{
    const response = await request(app)
        .post('/api/tickets')
        .send({});
    expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in',async()=>{
    const cookie = await signin();
});

it('returns an error if an invalid title is provided',async()=>{

});

it('returns an error if an invalid price is provided',async()=>{

});

it('create a ticket with valid parameters',async()=>{

});