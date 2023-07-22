import request from 'supertest';
import { app } from '../../app';

it('returns a 400 invalid credentials',async()=>{
    return request(app)
        .post('/api/users/sign-in')
        .send({
            email:'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('it fails when passwod is invalid',async()=>{
    await signin();
    return request(app)
        .post('/api/users/sign-in')
        .send({
            email:'test@test.com',
            password: 'passwor'
        })
        .expect(400);
});


it('sets a cookie after a successfull signup',async()=>{
    await signin();
    const response = await request(app)
        .post('/api/users/sign-in')
        .send({
            email:'test@test.com',
            password: 'password'
        })
        .expect(200);
    expect(response.body.token).toBeDefined()
})