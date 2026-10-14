import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

const testApp = express();
testApp.use(express.json());

testApp.get('/test/unhandled-error', () => {
  throw new Error('Simulated Database Connection Failure');
});

testApp.post('/test/validation-exception', (req, res, next) => {
  try {
    const { amount } = req.body;
    if (amount <= 0) {
      const err = new Error('Invalid Transaction Amount: Must be greater than 0');
      err.status = 400;
      throw err;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

testApp.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    statusCode: err.status || 500,
  });
});

describe('Exception Handling Architecture: Server & Controller Level', () => {
  test('Catches unhandled runtime exceptions and returns standardized HTTP 500 without process crash', async () => {
    const res = await request(testApp).get('/test/unhandled-error');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Simulated Database Connection Failure');
  });

  test('Gracefully propagates domain exceptions via next(err) with appropriate HTTP 400 status', async () => {
    const res = await request(testApp)
      .post('/test/validation-exception')
      .send({ amount: -100 });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Must be greater than 0/);
  });
});
