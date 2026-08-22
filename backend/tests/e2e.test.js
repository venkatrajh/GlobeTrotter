require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/services/prisma');

describe('Full-System End-to-End Integration & Verification', () => {
  let userA, tokenA;
  let userB, tokenB;
  let cityTokyo, cityKyoto;
  let activityTokyoTower, activityKyotoTemple;
  let tripAId, stop1Id, stop2Id;
  let publicSlug;
  let copiedTripId;

  beforeAll(async () => {
    // Fetch seeded cities and activities
    cityTokyo = await prisma.city.findFirst({ where: { name: 'Tokyo' } });
    cityKyoto = await prisma.city.findFirst({ where: { name: 'Kyoto' } });

    if (!cityTokyo || !cityKyoto) {
      cityTokyo = cityTokyo || await prisma.city.create({ data: { name: 'Tokyo', country: 'Japan' } });
      cityKyoto = cityKyoto || await prisma.city.create({ data: { name: 'Kyoto', country: 'Japan' } });
    }

    activityTokyoTower = await prisma.activity.findFirst({ where: { cityId: cityTokyo.id } });
    if (!activityTokyoTower) {
      activityTokyoTower = await prisma.activity.create({
        data: { name: 'Tokyo Tower', category: 'attraction', duration: 120, estimatedCost: 2000, cityId: cityTokyo.id }
      });
    }

    activityKyotoTemple = await prisma.activity.findFirst({ where: { cityId: cityKyoto.id } });
    if (!activityKyotoTemple) {
      activityKyotoTemple = await prisma.activity.create({
        data: { name: 'Kinkaku-ji', category: 'culture', duration: 90, estimatedCost: 500, cityId: cityKyoto.id }
      });
    }
  });

  afterAll(async () => {
    // Cleanup any test created data
    if (publicSlug) {
      await prisma.sharedTrip.deleteMany({ where: { slug: publicSlug } }).catch(() => {});
    }
    if (copiedTripId) {
      await prisma.stopActivity.deleteMany({ where: { tripStop: { tripId: copiedTripId } } }).catch(() => {});
      await prisma.tripStop.deleteMany({ where: { tripId: copiedTripId } }).catch(() => {});
      await prisma.budgetItem.deleteMany({ where: { tripId: copiedTripId } }).catch(() => {});
      await prisma.trip.deleteMany({ where: { id: copiedTripId } }).catch(() => {});
    }
    if (tripAId) {
      await prisma.stopActivity.deleteMany({ where: { tripStop: { tripId: tripAId } } }).catch(() => {});
      await prisma.tripStop.deleteMany({ where: { tripId: tripAId } }).catch(() => {});
      await prisma.budgetItem.deleteMany({ where: { tripId: tripAId } }).catch(() => {});
      await prisma.trip.deleteMany({ where: { id: tripAId } }).catch(() => {});
    }
    if (userA) {
      await prisma.user.deleteMany({ where: { id: userA.id } }).catch(() => {});
    }
    if (userB) {
      await prisma.user.deleteMany({ where: { id: userB.id } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  describe('1. Health & Status Check', () => {
    it('GET /api/health returns 200 and running message', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('backend is running');
    });
  });

  describe('2. Authentication & User Profile Lifecycle', () => {
    it('Sign up User A', async () => {
      const email = `usera-e2e-${Date.now()}@test.com`;
      const res = await request(app).post('/api/auth/signup').send({
        email,
        password: 'Password123!',
        name: 'User A Explorer',
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(email);
      expect(res.body.data.user.password).toBeUndefined(); // Password not exposed
      expect(res.body.data.token).toBeDefined();
      userA = res.body.data.user;
      tokenA = res.body.data.token;
    });

    it('Sign up User B', async () => {
      const email = `userb-e2e-${Date.now()}@test.com`;
      const res = await request(app).post('/api/auth/signup').send({
        email,
        password: 'Password123!',
        name: 'User B Voyager',
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.token).toBeDefined();
      userB = res.body.data.user;
      tokenB = res.body.data.token;
    });

    it('Login User A', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: userA.email,
        password: 'Password123!',
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.token).toBeDefined();
      tokenA = res.body.data.token;
    });

    it('Get User A Profile (GET /api/users/me)', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${tokenA}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.email).toBe(userA.email);
    });

    it('Update User A Profile (PUT /api/users/me)', async () => {
      const updatedEmail = `usera-updated-${Date.now()}@test.com`;
      const res = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ email: updatedEmail });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.email).toBe(updatedEmail);
      userA.email = updatedEmail;
    });
  });

  describe('3. Cities & Activities Search', () => {
    it('GET /api/cities returns seeded cities with authentication', async () => {
      const res = await request(app)
        .get('/api/cities')
        .set('Authorization', `Bearer ${tokenA}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET /api/activities returns activities with optional cityId filter', async () => {
      const res = await request(app)
        .get(`/api/activities?cityId=${cityTokyo.id}`)
        .set('Authorization', `Bearer ${tokenA}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.some((a) => a.cityId === cityTokyo.id)).toBe(true);
    });
  });

  describe('4. Trip Creation, Stops & Activities (User A)', () => {
    it('User A creates a trip', async () => {
      const res = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          title: 'Japan Grand Journey',
          description: 'Tokyo and Kyoto adventure',
          destination: 'Japan',
          startDate: '2026-10-01',
          endDate: '2026-10-15',
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.ownerId).toBe(userA.id);
      tripAId = res.body.data.id;
    });

    it('User A adds Stop 1 (Tokyo)', async () => {
      const res = await request(app)
        .post(`/api/trips/${tripAId}/stops`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          cityId: cityTokyo.id,
          startDate: '2026-10-01',
          endDate: '2026-10-07',
          order: 0,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.cityId).toBe(cityTokyo.id);
      stop1Id = res.body.data.id;
    });

    it('User A adds Stop 2 (Kyoto)', async () => {
      const res = await request(app)
        .post(`/api/trips/${tripAId}/stops`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          cityId: cityKyoto.id,
          startDate: '2026-10-08',
          endDate: '2026-10-15',
          order: 1,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.cityId).toBe(cityKyoto.id);
      stop2Id = res.body.data.id;
    });

    it('User A adds Stop Activities to Tokyo and Kyoto stops', async () => {
      const actRes1 = await request(app)
        .post(`/api/stops/${stop1Id}/activities`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          activityId: activityTokyoTower.id,
          scheduledDate: '2026-10-02',
          order: 0,
          notes: 'Visit observation deck',
        });
      expect(actRes1.statusCode).toBe(201);

      const actRes2 = await request(app)
        .post(`/api/stops/${stop2Id}/activities`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          activityId: activityKyotoTemple.id,
          scheduledDate: '2026-10-09',
          order: 0,
          notes: 'Morning tea ceremony',
        });
      expect(actRes2.statusCode).toBe(201);
    });

    it('User A updates Stop 1 details', async () => {
      const res = await request(app)
        .put(`/api/stops/${stop1Id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          startDate: '2026-10-01',
          endDate: '2026-10-06',
          order: 0,
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.id).toBe(stop1Id);
    });

    it('User A fetches Full Itinerary (GET /api/trips/:id/full)', async () => {
      const res = await request(app)
        .get(`/api/trips/${tripAId}/full`)
        .set('Authorization', `Bearer ${tokenA}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.stops.length).toBe(2);
      expect(res.body.data.stops[0].activities.length).toBeGreaterThan(0);
      expect(res.body.data.stops[0].city).toBeDefined();
    });

    it('User A fetches Timeline (GET /api/trips/:id/timeline)', async () => {
      const res = await request(app)
        .get(`/api/trips/${tripAId}/timeline`)
        .set('Authorization', `Bearer ${tokenA}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('5. Deterministic Budget Management', () => {
    it('User A creates Budget Items with valid categories', async () => {
      const bRes1 = await request(app)
        .post(`/api/trips/${tripAId}/budget/items`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          amount: 50000,
          category: 'stay',
          description: 'Ryokan stay in Kyoto',
        });
      expect(bRes1.statusCode).toBe(201);

      const bRes2 = await request(app)
        .post(`/api/trips/${tripAId}/budget/items`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          amount: 15000,
          category: 'transport',
          description: 'Shinkansen bullet train',
        });
      expect(bRes2.statusCode).toBe(201);
    });

    it('User A fetches Trip Budget (GET /api/trips/:id/budget)', async () => {
      const res = await request(app)
        .get(`/api/trips/${tripAId}/budget`)
        .set('Authorization', `Bearer ${tokenA}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.total).toBe(65000);
      expect(res.body.data.breakdown.stay).toBe(50000);
      expect(res.body.data.breakdown.transport).toBe(15000);
    });
  });

  describe('6. AI Trip Generator & AI Budget Optimizer Boundary', () => {
    it('POST /api/ai/trip-generator returns valid schema response', async () => {
      const res = await request(app)
        .post('/api/ai/trip-generator')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          destination: 'Japan',
          days: 12,
          budget: 180000,
          currency: 'USD',
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.trip_summary).toBeDefined();
      expect(res.body.data.days).toBeDefined();
    });

    it('POST /api/ai/budget-optimizer returns optimization suggestions', async () => {
      const res = await request(app)
        .post('/api/ai/budget-optimizer')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          budget: 150000,
          currency: 'USD',
          itinerary: {
            destination: 'Japan',
            days: [
              {
                day: 1,
                city: 'Tokyo',
                activities: [
                  { name: 'Tokyo Tower', category: 'attraction', suggested_time: '10:00', duration_minutes: 120, estimated_cost: 2000 },
                  { name: 'Sushi Dinner', category: 'food', suggested_time: '19:00', duration_minutes: 90, estimated_cost: 5000 },
                ],
                estimated_daily_cost: 7000
              },
            ],
          },
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.summary).toBeDefined();
      expect(res.body.data.suggestions).toBeDefined();
    });
  });

  describe('7. Public Sharing & Deep Copy Flow', () => {
    it('User A creates a public share link (POST /api/trips/:id/share)', async () => {
      const res = await request(app)
        .post(`/api/trips/${tripAId}/share`)
        .set('Authorization', `Bearer ${tokenA}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.isPublic).toBe(true);
      expect(res.body.data.slug).toBeDefined();
      publicSlug = res.body.data.slug;
    });

    it('Unauthenticated public user views trip (GET /api/public/trips/:slug)', async () => {
      const res = await request(app).get(`/api/public/trips/${publicSlug}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.title).toBe('Japan Grand Journey');
      expect(res.body.data.stops.length).toBe(2);
      expect(res.body.data.budgetSummary).toBeDefined();
    });

    it('User B copies public trip (POST /api/public/trips/:slug/copy)', async () => {
      const res = await request(app)
        .post(`/api/public/trips/${publicSlug}/copy`)
        .set('Authorization', `Bearer ${tokenB}`);
      expect(res.statusCode).toBe(201);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.ownerId).toBe(userB.id);
      expect(res.body.data.title).toContain('Copy of Japan Grand Journey');
      copiedTripId = res.body.data.id;
    });

    it('User B fetches their trips and sees copied trip (GET /api/trips)', async () => {
      const res = await request(app)
        .get('/api/trips')
        .set('Authorization', `Bearer ${tokenB}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.some((t) => t.id === copiedTripId)).toBe(true);
    });

    it('User B gets full itinerary of their copied trip with deep-cloned stops and budget', async () => {
      const res = await request(app)
        .get(`/api/trips/${copiedTripId}/full`)
        .set('Authorization', `Bearer ${tokenB}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.stops.length).toBe(2);
      expect(res.body.data.budgetItems.length).toBe(2);
      expect(res.body.data.budgetSummary.total).toBe(65000);
      expect(res.body.data.budgetSummary.breakdown.stay).toBe(50000);
      expect(res.body.data.budgetSummary.breakdown.transport).toBe(15000);
    });

    it('User A disables sharing (DELETE /api/trips/:id/share)', async () => {
      const res = await request(app)
        .delete(`/api/trips/${tripAId}/share`)
        .set('Authorization', `Bearer ${tokenA}`);
      expect(res.statusCode).toBe(200);
    });

    it('Public access to disabled slug returns 404', async () => {
      const res = await request(app).get(`/api/public/trips/${publicSlug}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('8. Security, Ownership & Error Handling', () => {
    it('User B cannot access User A private trip (404)', async () => {
      const res = await request(app)
        .get(`/api/trips/${tripAId}`)
        .set('Authorization', `Bearer ${tokenB}`);
      expect(res.statusCode).toBe(404);
    });

    it('User B cannot update User A private trip (404)', async () => {
      const res = await request(app)
        .put(`/api/trips/${tripAId}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ title: 'Hacked Trip' });
      expect(res.statusCode).toBe(404);
    });

    it('User B cannot delete User A private trip (404)', async () => {
      const res = await request(app)
        .delete(`/api/trips/${tripAId}`)
        .set('Authorization', `Bearer ${tokenB}`);
      expect(res.statusCode).toBe(404);
    });

    it('Unauthenticated request to protected trip route is rejected (401)', async () => {
      const res = await request(app).get('/api/trips');
      expect(res.statusCode).toBe(401);
    });

    it('Invalid JWT token is rejected (401)', async () => {
      const res = await request(app)
        .get('/api/trips')
        .set('Authorization', 'Bearer invalid-token-string');
      expect(res.statusCode).toBe(401);
    });

    it('Invalid input validation returns 400', async () => {
      const res = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          title: '', // Invalid empty title
          startDate: 'invalid-date',
          endDate: '2026-01-01',
        });
      expect(res.statusCode).toBe(400);
    });
  });
});
