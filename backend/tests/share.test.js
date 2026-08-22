require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/services/prisma');
const bcrypt = require('bcryptjs');

describe('Public Trip Sharing API', () => {
  let user1, token1;
  let user2, token2;
  let trip1Id;
  let trip2Id;
  let publicSlug;

  beforeAll(async () => {
    const pwd = await bcrypt.hash('password123', 10);
    user1 = await prisma.user.create({ data: { email: `u1s-${Date.now()}@test.com`, password: pwd }});
    user2 = await prisma.user.create({ data: { email: `u2s-${Date.now()}@test.com`, password: pwd }});

    const res1 = await request(app).post('/api/auth/login').send({ email: user1.email, password: 'password123' });
    token1 = res1.body.data.token;

    const res2 = await request(app).post('/api/auth/login').send({ email: user2.email, password: 'password123' });
    token2 = res2.body.data.token;

    const trip1 = await prisma.trip.create({
      data: {
        title: 'Share Trip 1',
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-09-10'),
        ownerId: user1.id,
      }
    });
    trip1Id = trip1.id;

    const trip2 = await prisma.trip.create({
      data: {
        title: 'Share Trip 2',
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-09-10'),
        ownerId: user2.id,
      }
    });
    trip2Id = trip2.id;
  });

  afterAll(async () => {
    await prisma.sharedTrip.deleteMany({});
    await prisma.trip.deleteMany({});
    await prisma.user.deleteMany({ where: { id: { in: [user1.id, user2.id] } } });
    await prisma.$disconnect();
  });

  it('1. Owner can create a public share', async () => {
    const res = await request(app)
      .post(`/api/trips/${trip1Id}/share`)
      .set('Authorization', `Bearer ${token1}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBeDefined();
    expect(res.body.data.isPublic).toBe(true);
    publicSlug = res.body.data.slug;
  });

  it('2. Owner can retrieve share status', async () => {
    const res = await request(app)
      .get(`/api/trips/${trip1Id}/share`)
      .set('Authorization', `Bearer ${token1}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe(publicSlug);
    expect(res.body.data.isPublic).toBe(true);
  });

  it('3. Public endpoint returns shared itinerary & 4. works without JWT', async () => {
    const res = await request(app).get(`/api/public/trips/${publicSlug}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Share Trip 1');
    expect(res.body.data.budgetSummary).toBeDefined();
  });

  it('5. Public response does not expose owner email & 6. password hash & 7. JWT', async () => {
    const res = await request(app).get(`/api/public/trips/${publicSlug}`);
    const tripData = res.body.data;

    expect(tripData).not.toHaveProperty('owner');
    expect(tripData).not.toHaveProperty('ownerId');
    expect(JSON.stringify(tripData)).not.toMatch(user1.email);
    expect(JSON.stringify(tripData)).not.toMatch('password');
    expect(JSON.stringify(tripData)).not.toMatch('token');
  });

  it('8. Non-owner cannot create a share for another user\'s trip', async () => {
    const res = await request(app)
      .post(`/api/trips/${trip1Id}/share`)
      .set('Authorization', `Bearer ${token2}`);
    expect(res.statusCode).toBe(404);
  });

  it('9. Non-owner cannot delete another user\'s share', async () => {
    const res = await request(app)
      .delete(`/api/trips/${trip1Id}/share`)
      .set('Authorization', `Bearer ${token2}`);
    expect(res.statusCode).toBe(404);
  });

  it('10. Non-owner cannot access private trip through owner endpoints', async () => {
    const res = await request(app)
      .get(`/api/trips/${trip1Id}/share`)
      .set('Authorization', `Bearer ${token2}`);
    expect(res.statusCode).toBe(404);
  });

  it('11. Disabled share is no longer publicly accessible', async () => {
    const disableRes = await request(app)
      .delete(`/api/trips/${trip1Id}/share`)
      .set('Authorization', `Bearer ${token1}`);
    expect(disableRes.statusCode).toBe(200);

    const pubRes = await request(app).get(`/api/public/trips/${publicSlug}`);
    expect(pubRes.statusCode).toBe(404);
  });

  it('12. Invalid slug returns 404', async () => {
    const res = await request(app).get('/api/public/trips/invalid_slug_123');
    expect(res.statusCode).toBe(404);
  });

  it('13. Two trips receive different public slugs', async () => {
    // Re-enable trip1
    const res1 = await request(app)
      .post(`/api/trips/${trip1Id}/share`)
      .set('Authorization', `Bearer ${token1}`);

    // Enable trip2
    const res2 = await request(app)
      .post(`/api/trips/${trip2Id}/share`)
      .set('Authorization', `Bearer ${token2}`);

    expect(res1.body.data.slug).not.toEqual(res2.body.data.slug);
  });
});
