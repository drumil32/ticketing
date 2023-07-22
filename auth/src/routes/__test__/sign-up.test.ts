import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successfull signup',async()=>{
    const response = await request(app)
        .post('/api/users/sign-up')
        .send({
            email:'test@test.com',
            password: 'password'
        })
        .expect(201);
});

it('returns a 400 with invalid email',async()=>{
    return request(app)
        .post('/api/users/sign-up')
        .send({
            email:'test@test',
            password: 'password'
        })
        .expect(400);
});

it('returns a 400 with invalid password',async()=>{
    return request(app)
        .post('/api/users/sign-up')
        .send({
            email:'test@test',
            password: 'p'
        })
        .expect(400);
});

it('returns a 400 with email and password is required',async()=>{
    await request(app)
    .post('/api/users/sign-up')
    .send({
        email:'test@test',
    })
    .expect(400);
    await request(app)
        .post('/api/users/sign-up')
        .send({
            password: 'password'
        })
        .expect(400);
});

it('disallow duplicate emails',async()=>{
    await signin();

    await request(app)
        .post('/api/users/sign-up')
        .send({
            email:'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('sets a cookie after a successfull signup',async()=>{
    const response = await request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    expect(response.body.token).toBeDefined()
})