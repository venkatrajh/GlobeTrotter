const crypto = require('crypto');
const prisma = require('./prisma');
const { calculateBudgetSummary } = require('./budgetService');

const generateSlug = () => {
  return crypto.randomBytes(12).toString('url-safe-base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
};

const getTripShareStatus = async (tripId) => {
  return prisma.sharedTrip.findFirst({
    where: { tripId, isPublic: true },
  });
};

const createOrUpdateShare = async (tripId) => {
  // Check if a share already exists
  const existing = await prisma.sharedTrip.findFirst({
    where: { tripId },
  });

  if (existing) {
    if (!existing.isPublic) {
      return prisma.sharedTrip.update({
        where: { id: existing.id },
        data: { isPublic: true },
      });
    }
    return existing;
  }

  // Handle slug collision via retry
  let retries = 3;
  while (retries > 0) {
    try {
      const slug = crypto.randomBytes(16).toString('hex');
      const sharedTrip = await prisma.sharedTrip.create({
        data: {
          tripId,
          slug,
          isPublic: true,
        },
      });
      return sharedTrip;
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
        retries--;
        continue;
      }
      throw error;
    }
  }
  throw new Error('Failed to generate a unique public slug');
};

const disableShare = async (tripId) => {
  const existing = await prisma.sharedTrip.findFirst({
    where: { tripId },
  });

  if (existing) {
    return prisma.sharedTrip.update({
      where: { id: existing.id },
      data: { isPublic: false },
    });
  }
  return null;
};

const getPublicItinerary = async (slug) => {
  const sharedTrip = await prisma.sharedTrip.findUnique({
    where: { slug },
  });

  if (!sharedTrip || !sharedTrip.isPublic) {
    return null;
  }

  const trip = await prisma.trip.findUnique({
    where: { id: sharedTrip.tripId },
    select: {
      id: true,
      title: true,
      description: true,
      startDate: true,
      endDate: true,
      destination: true,
      budgetItems: {
        select: {
          id: true,
          amount: true,
          category: true,
          description: true,
        }
      },
      stops: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          startDate: true,
          endDate: true,
          order: true,
          city: {
            select: {
              id: true,
              name: true,
              country: true,
              description: true,
            }
          },
          activities: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              scheduledDate: true,
              order: true,
              notes: true,
              activity: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  category: true,
                  duration: true,
                  estimatedCost: true,
                }
              }
            }
          }
        }
      }
    }
  });

  if (!trip) return null;

  // Compute budget summary for public view
  const budgetSummary = calculateBudgetSummary(trip.budgetItems);

  return {
    ...trip,
    budgetSummary,
  };
};

module.exports = {
  getTripShareStatus,
  createOrUpdateShare,
  disableShare,
  getPublicItinerary,
};
