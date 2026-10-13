import supertest from 'supertest';
import { app } from '../server.js';

const request = supertest(app);

describe('Black Box Testing: Authentication API', () => {
  test('POST /api/auth/login with invalid credentials should return 401', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({
        email: 'invalid@paygate.com',
        password: 'wrongpassword'
      });
    
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('Black Box Testing: Health Check', () => {
  test('GET /api/health should return system status', async () => {
    const res = await request.get('/api/health');
    
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('status');
    expect(res.body.data).toHaveProperty('database');
  });
});
