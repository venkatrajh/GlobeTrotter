require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/services/prisma');
const bcrypt = require('bcryptjs');

describe('Budget API', () => {
  let user1, token1;
  let user2, token2;
  let trip1Id;
  let budgetItem1Id;

  beforeAll(async () => {
    const pwd = await bcrypt.hash('password123', 10);
    user1 = await prisma.user.create({ data: { email: `u1b-${Date.now()}@test.com`, password: pwd }});
    user2 = await prisma.user.create({ data: { email: `u2b-${Date.now()}@test.com`, password: pwd }});

    const res1 = await request(app).post('/api/auth/login').send({ email: user1.email, password: 'password123' });
    token1 = res1.body.data.token;

    const res2 = await request(app).post('/api/auth/login').send({ email: user2.email, password: 'password123' });
    token2 = res2.body.data.token;

    const trip = await prisma.trip.create({
      data: {
        title: 'Budget Trip 1',
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-09-10'),
        ownerId: user1.id,
      }
    });
    trip1Id = trip.id;
  });

  afterAll(async () => {
    await prisma.budgetItem.deleteMany({});
    await prisma.trip.deleteMany({});
    await prisma.user.deleteMany({ where: { id: { in: [user1.id, user2.id] } } });
    await prisma.$disconnect();
  });

  it('1. Create budget item', async () => {
    const res = await request(app)
      .post(`/api/trips/${trip1Id}/budget/items`)
      .set('Authorization', `Bearer ${token1}`)
      .send({ amount: 1500, category: 'stay', description: 'Hotel' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    budgetItem1Id = res.body.data.id;
  });

  it('2. Get budget items', async () => {
    const res = await request(app)
      .get(`/api/trips/${trip1Id}/budget/items`)
      .set('Authorization', `Bearer ${token1}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  it('3. Update budget item', async () => {
    const res = await request(app)
      .put(`/api/budget/items/${budgetItem1Id}`)
      .set('Authorization', `Bearer ${token1}`)
      .send({ amount: 2000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.amount).toBe(2000);
  });

  it('5. Calculate total correctly & 6. Category breakdown correctly & 7. Aggregate correctly & 8. Zero-value', async () => {
    await request(app)
      .post(`/api/trips/${trip1Id}/budget/items`)
      .set('Authorization', `Bearer ${token1}`)
      .send({ amount: 500.55, category: 'transport', description: 'Flight' });

    await request(app)
      .post(`/api/trips/${trip1Id}/budget/items`)
      .set('Authorization', `Bearer ${token1}`)
      .send({ amount: 1000.45, category: 'transport', description: 'Train' });

    await request(app)
      .post(`/api/trips/${trip1Id}/budget/items`)
      .set('Authorization', `Bearer ${token1}`)
      .send({ amount: 0, category: 'other', description: 'Free stuff' }); // Zero value

    const res = await request(app)
      .get(`/api/trips/${trip1Id}/budget`)
      .set('Authorization', `Bearer ${token1}`);

    expect(res.statusCode).toBe(200);
    const data = res.body.data;
    // previous stay = 2000. New transport = 500.55 + 1000.45 = 1501. Total = 3501.
    expect(data.total).toBe(3501);
    expect(data.breakdown.transport).toBe(1501);
    expect(data.breakdown.stay).toBe(2000);
    expect(data.breakdown.other).toBe(0);
  });

  it('9. Invalid negative amount rejected', async () => {
    const res = await request(app)
      .post(`/api/trips/${trip1Id}/budget/items`)
      .set('Authorization', `Bearer ${token1}`)
      .send({ amount: -100, category: 'meal' });
    expect(res.statusCode).toBe(400);
  });

  it('10. Invalid amount rejected (NaN / string)', async () => {
    const res = await request(app)
      .post(`/api/trips/${trip1Id}/budget/items`)
      .set('Authorization', `Bearer ${token1}`)
      .send({ amount: "hundred", category: 'meal' });
    expect(res.statusCode).toBe(400);
  });

  it('11. Unauthenticated budget request rejected', async () => {
    const res = await request(app).get(`/api/trips/${trip1Id}/budget`);
    expect(res.statusCode).toBe(401);
  });

  it('12. User cannot access another user budget', async () => {
    const res = await request(app)
      .get(`/api/trips/${trip1Id}/budget`)
      .set('Authorization', `Bearer ${token2}`);
    expect(res.statusCode).toBe(404);
  });

  it('13. User cannot modify another user budget', async () => {
    const res = await request(app)
      .put(`/api/budget/items/${budgetItem1Id}`)
      .set('Authorization', `Bearer ${token2}`)
      .send({ amount: 999 });
    expect(res.statusCode).toBe(404);
  });

  it('4. Delete budget item', async () => {
    const res = await request(app)
      .delete(`/api/budget/items/${budgetItem1Id}`)
      .set('Authorization', `Bearer ${token1}`);
    expect(res.statusCode).toBe(200);
  });

  it('14. Full itinerary budget summary remains correct', async () => {
    const res = await request(app)
      .get(`/api/trips/${trip1Id}/full`)
      .set('Authorization', `Bearer ${token1}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.budgetItems).toBeDefined();
    // 3 items left (2 transport, 1 zero-value)
    expect(res.body.data.budgetItems.length).toBe(3);
  });
});
