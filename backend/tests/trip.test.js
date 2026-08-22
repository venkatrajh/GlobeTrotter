require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/services/prisma');
const bcrypt = require('bcryptjs');

describe('Trip & Itinerary API', () => {
  let user1, token1;
  let user2, token2;
  let city, activity;
  let trip1Id;
  let tripStop1Id;

  beforeAll(async () => {
    // Setup users
    const pwd = await bcrypt.hash('password123', 10);
    user1 = await prisma.user.create({ data: { email: `u1-${Date.now()}@test.com`, password: pwd }});
    user2 = await prisma.user.create({ data: { email: `u2-${Date.now()}@test.com`, password: pwd }});

    // Login users to get tokens
    const res1 = await request(app).post('/api/auth/login').send({ email: user1.email, password: 'password123' });
    token1 = res1.body.data.token;

    const res2 = await request(app).post('/api/auth/login').send({ email: user2.email, password: 'password123' });
    token2 = res2.body.data.token;

    // Setup master data
    city = await prisma.city.create({ data: { name: 'TestCity' }});
    activity = await prisma.activity.create({ data: { name: 'TestActivity', category: 'fun', cityId: city.id }});
  });

  afterAll(async () => {
    // Clean up
    await prisma.stopActivity.deleteMany({});
    await prisma.tripStop.deleteMany({});
    await prisma.budgetItem.deleteMany({});
    await prisma.sharedTrip.deleteMany({});
    await prisma.activity.deleteMany({ where: { id: activity.id } });
    await prisma.city.deleteMany({ where: { id: city.id } });
    await prisma.trip.deleteMany({});
    await prisma.user.deleteMany({ where: { id: { in: [user1.id, user2.id] } } });
    await prisma.$disconnect();
  });

  it('1. Create trip while authenticated', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        title: 'Trip 1',
        startDate: '2026-09-01',
        endDate: '2026-09-10'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    trip1Id = res.body.data.id;
  });

  it('2. Create trip without authentication', async () => {
    const res = await request(app)
      .post('/api/trips')
      .send({
        title: 'Trip Unauth',
        startDate: '2026-09-01',
        endDate: '2026-09-10'
      });
    expect(res.statusCode).toBe(401);
  });

  it('3. Invalid trip dates rejected', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        title: 'Trip Invalid Dates',
        startDate: '2026-09-10',
        endDate: '2026-09-01'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/cannot be before/i);
  });

  it('4. List only authenticated user trips', async () => {
    const res = await request(app).get('/api/trips').set('Authorization', `Bearer ${token2}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(0); // user2 has no trips
  });

  it('5. Get owned trip', async () => {
    const res = await request(app).get(`/api/trips/${trip1Id}`).set('Authorization', `Bearer ${token1}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Trip 1');
  });

  it('6. Cannot access another user trip', async () => {
    const res = await request(app).get(`/api/trips/${trip1Id}`).set('Authorization', `Bearer ${token2}`);
    expect(res.statusCode).toBe(404);
  });

  it('7. Update owned trip', async () => {
    const res = await request(app)
      .put(`/api/trips/${trip1Id}`)
      .set('Authorization', `Bearer ${token1}`)
      .send({ title: 'Trip 1 Updated' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Trip 1 Updated');
  });

  it('8. Delete owned trip', async () => {
    // Create a temp trip to delete
    const createRes = await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${token1}`)
      .send({ title: 'To Delete', startDate: '2026-09-01', endDate: '2026-09-10' });

    const delId = createRes.body.data.id;
    const delRes = await request(app).delete(`/api/trips/${delId}`).set('Authorization', `Bearer ${token1}`);
    expect(delRes.statusCode).toBe(200);
  });

  it('9. Create trip stop', async () => {
    const res = await request(app)
      .post(`/api/trips/${trip1Id}/stops`)
      .set('Authorization', `Bearer ${token1}`)
      .send({
        cityId: city.id,
        startDate: '2026-09-02',
        endDate: '2026-09-05',
        order: 1
      });
    expect(res.statusCode).toBe(201);
    tripStop1Id = res.body.data.id;
  });

  it('10. Reject stop for another user trip', async () => {
    const res = await request(app)
      .post(`/api/trips/${trip1Id}/stops`)
      .set('Authorization', `Bearer ${token2}`)
      .send({
        cityId: city.id,
        startDate: '2026-09-02',
        endDate: '2026-09-05',
        order: 2
      });
    expect(res.statusCode).toBe(404);
  });

  it('11. Invalid stop date rejected (outside trip)', async () => {
    const res = await request(app)
      .post(`/api/trips/${trip1Id}/stops`)
      .set('Authorization', `Bearer ${token1}`)
      .send({
        cityId: city.id,
        startDate: '2026-08-01', // Before trip
        endDate: '2026-08-05',
        order: 3
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/within trip dates/i);
  });

  it('12. Add activity to owned stop', async () => {
    const res = await request(app)
      .post(`/api/stops/${tripStop1Id}/activities`)
      .set('Authorization', `Bearer ${token1}`)
      .send({
        activityId: activity.id,
        order: 1
      });
    expect(res.statusCode).toBe(201);
  });

  it('13. Reject activity addition to another user stop', async () => {
    const res = await request(app)
      .post(`/api/stops/${tripStop1Id}/activities`)
      .set('Authorization', `Bearer ${token2}`)
      .send({
        activityId: activity.id,
        order: 2
      });
    expect(res.statusCode).toBe(404);
  });

  it('14. Get complete itinerary', async () => {
    const res = await request(app).get(`/api/trips/${trip1Id}/full`).set('Authorization', `Bearer ${token1}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('stops');
    expect(res.body.data.stops[0]).toHaveProperty('activities');
    expect(res.body.data.stops[0].activities.length).toBe(1);
  });

  it('15. Complete itinerary preserves correct ordering', async () => {
    // Add second stop with order 2
    await request(app)
      .post(`/api/trips/${trip1Id}/stops`)
      .set('Authorization', `Bearer ${token1}`)
      .send({
        cityId: city.id,
        startDate: '2026-09-06',
        endDate: '2026-09-09',
        order: 2
      });

    const res = await request(app).get(`/api/trips/${trip1Id}/full`).set('Authorization', `Bearer ${token1}`);
    expect(res.statusCode).toBe(200);
    const stops = res.body.data.stops;
    expect(stops.length).toBe(2);
    expect(stops[0].order).toBe(1);
    expect(stops[1].order).toBe(2);
  });

});
