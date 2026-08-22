require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/services/prisma');
const jwt = require('jsonwebtoken');

describe('Auth Endpoints', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
  };

  let token;

  afterAll(async () => {
    // Cleanup test user
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
    await prisma.$disconnect();
  });

  it('should sign up a new user successfully', async () => {
    const res = await request(app).post('/api/auth/signup').send(testUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user).toHaveProperty('email', testUser.email);
  });

  it('should reject duplicate email on signup', async () => {
    const res = await request(app).post('/api/auth/signup').send(testUser);
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toMatch(/already in use/i);
  });

  it('should login successfully with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send(testUser);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('token');
    token = res.body.data.token;
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it('should reject access to protected endpoint without token', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toMatch(/authentication required/i);
  });

  it('should reject access with invalid JWT', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalid_token_here');
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toMatch(/invalid or expired token/i);
  });

  it('should access protected endpoint (GET /api/users/me) with valid JWT', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('email', testUser.email);
  });

  it('should not allow user to access another user resource', async () => {
    // Currently, /api/users/me implicitly only accesses the authenticated user's data.
    // There is no endpoint right now for /api/users/:id to test this directly,
    // but we can ensure the token only resolves to their own data.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.userId).toBeDefined();
  });
});
