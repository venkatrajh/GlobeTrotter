const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/services/prisma');
const bcrypt = require('bcryptjs');

let userToken;

beforeAll(async () => {
  // Clear DB
  await prisma.user.deleteMany();

  // Create user
  const hashedPassword = await bcrypt.hash('testpass', 10);
  const user = await prisma.user.create({
    data: { email: 'ai@test.com', password: hashedPassword }
  });

  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'ai@test.com', password: 'testpass' });

  userToken = res.body.data.token;
});

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('AI Endpoints', () => {
  it('POST /api/ai/trip-generator should generate a trip', async () => {
    const payload = {
      destination: "Tokyo",
      days: 5,
      budget: 2000,
      currency: "USD",
      travel_style: "balanced",
      interests: ["culture", "food"],
      pace: "balanced"
    };

    const res = await request(app)
      .post('/api/ai/trip-generator')
      .set('Authorization', `Bearer ${userToken}`)
      .send(payload);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.destination).toBe('Tokyo');
  });

  it('POST /api/ai/trip-generator should fail with missing fields', async () => {
    const payload = {
      destination: "Tokyo"
      // Missing days, budget, currency
    };

    const res = await request(app)
      .post('/api/ai/trip-generator')
      .set('Authorization', `Bearer ${userToken}`)
      .send(payload);

    // It uses our auth validator style which throws a 400 status
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/ai/budget-optimizer should optimize budget', async () => {
    const payload = {
      budget: 3000,
      currency: "USD",
      itinerary: {
        destination: "Tokyo",
        days: [
          {
            day: 1,
            city: "Tokyo",
            activities: [
              {
                name: "Costly Activity",
                category: "attraction",
                suggested_time: "10:00",
                duration_minutes: 120,
                estimated_cost: 500
              }
            ]
          }
        ]
      }
    };

    const res = await request(app)
      .post('/api/ai/budget-optimizer')
      .set('Authorization', `Bearer ${userToken}`)
      .send(payload);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.suggestions).toBeDefined();
  });

  it('POST /api/ai/trip-generator without auth should return 401', async () => {
    const res = await request(app)
      .post('/api/ai/trip-generator')
      .send({});

    expect(res.statusCode).toEqual(401);
  });
});
