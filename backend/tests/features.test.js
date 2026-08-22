const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/services/prisma');
const bcrypt = require('bcryptjs');

let userToken;
let userId;
let tripId;
let publicSlug;
let cityId;
let activityId;

beforeAll(async () => {
  // Clear DB
  await prisma.stopActivity.deleteMany();
  await prisma.tripStop.deleteMany();
  await prisma.budgetItem.deleteMany();
  await prisma.sharedTrip.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  // Create user
  const hashedPassword = await bcrypt.hash('testpass', 10);
  const user = await prisma.user.create({
    data: { email: 'feature@test.com', password: hashedPassword }
  });
  userId = user.id;

  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'feature@test.com', password: 'testpass' });
  userToken = res.body.data.token;

  // Create City
  const city = await prisma.city.create({ data: { name: 'TestCity', country: 'TestCountry' } });
  cityId = city.id;

  // Create Activity
  const activity = await prisma.activity.create({
    data: { name: 'TestActivity', category: 'attraction', cityId: city.id }
  });
  activityId = activity.id;

  // Create Trip
  const trip = await prisma.trip.create({
    data: {
      title: 'Feature Trip',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-10'),
      ownerId: userId
    }
  });
  tripId = trip.id;

  // Create Public Share
  const share = await prisma.sharedTrip.create({
    data: { tripId: trip.id, slug: 'test-slug', isPublic: true }
  });
  publicSlug = share.slug;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Feature Endpoints', () => {
  it('GET /api/cities should return paginated cities', async () => {
    const res = await request(app)
      .get('/api/cities?search=TestCity')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.pagination).toBeDefined();
  });

  it('GET /api/activities should return paginated activities', async () => {
    const res = await request(app)
      .get('/api/activities')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  it('GET /api/activities/:id should return single activity', async () => {
    const res = await request(app)
      .get(`/api/activities/${activityId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.name).toBe('TestActivity');
  });

  it('GET /api/trips/:id/timeline should return timeline events', async () => {
    const res = await request(app)
      .get(`/api/trips/${tripId}/timeline`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('POST /api/public/trips/:slug/copy should duplicate a public trip', async () => {
    const res = await request(app)
      .post(`/api/public/trips/${publicSlug}/copy`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.title).toContain('Copy of');
  });

  it('DELETE /api/users/me should delete user and cascade data', async () => {
    const res = await request(app)
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);

    // Check user is gone
    const userCheck = await prisma.user.findUnique({ where: { id: userId } });
    expect(userCheck).toBeNull();
  });
});
