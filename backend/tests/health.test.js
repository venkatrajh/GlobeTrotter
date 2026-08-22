const request = require('supertest');
const app = require('../src/app');

describe('Health Endpoint', () => {
  it('should return 200 and a success message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'GlobeTrotter backend is running');
  });
});
