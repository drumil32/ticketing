import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
    const token = await signin();
    const response = await request(app)
        .get('/api/users/current-user')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authorized', async () => {
    const response = await request(app)
        .get('/api/users/current-user')
        .send()
        .expect(200)
    expect(response.body.currentUser).toEqual(null)
})