const prisma = require('../services/prisma');

const createTrip = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, destination } = req.body;

    const trip = await prisma.trip.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        destination,
        ownerId: req.userId,
      }
    });

    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

const getTrips = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where: { ownerId: req.userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.trip.count({ where: { ownerId: req.userId } })
    ]);

    res.status(200).json({
      success: true,
      data: trips,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getTripById = async (req, res, next) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id }
    });

    if (!trip || trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const existing = await prisma.trip.findUnique({ where: { id: tripId }});

    if (!existing || existing.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const { title, description, startDate, endDate, destination } = req.body;

    // If one date is provided but not both, revalidate logic:
    // (Actually handled partially in Zod, but let's double check here if needed)
    const newStart = startDate ? new Date(startDate) : existing.startDate;
    const newEnd = endDate ? new Date(endDate) : existing.endDate;

    if (newStart > newEnd) {
      return res.status(400).json({ success: false, message: 'End date cannot be before start date' });
    }

    const trip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        destination,
      }
    });

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const existing = await prisma.trip.findUnique({ where: { id: tripId }});

    if (!existing || existing.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    await prisma.$transaction([
      prisma.stopActivity.deleteMany({ where: { tripStop: { tripId } } }),
      prisma.tripStop.deleteMany({ where: { tripId } }),
      prisma.budgetItem.deleteMany({ where: { tripId } }),
      prisma.sharedTrip.deleteMany({ where: { tripId } }),
      prisma.trip.delete({ where: { id: tripId } })
    ]);

    res.status(200).json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const { calculateBudgetSummary } = require('../services/budgetService');

const getFullItinerary = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        stops: {
          orderBy: { order: 'asc' },
          include: {
            city: true,
            activities: {
              orderBy: { order: 'asc' },
              include: {
                activity: true
              }
            }
          }
        },
        budgetItems: true,
      }
    });

    if (!trip || trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const budgetSummary = calculateBudgetSummary(trip.budgetItems);

    // Inject the deterministic summary into the response
    const responseData = {
      ...trip,
      budgetSummary
    };

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    next(error);
  }
};


const getTripTimeline = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        stops: {
          include: {
            city: true,
            activities: {
              include: { activity: true }
            }
          }
        }
      }
    });

    if (!trip || trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Flatten and sort chronologically
    let timelineEvents = [];

    for (const stop of trip.stops) {
      // Add stop arrival event
      timelineEvents.push({
        type: 'arrival',
        date: stop.startDate,
        title: `Arrival in ${stop.city.name}`,
        city: stop.city.name,
        sortKey: stop.startDate.getTime()
      });

      for (const sa of stop.activities) {
        const eventDate = sa.scheduledDate || stop.startDate; // Fallback to stop start
        timelineEvents.push({
          type: 'activity',
          date: eventDate,
          title: sa.activity.name,
          category: sa.activity.category,
          duration: sa.activity.duration,
          notes: sa.notes,
          order: sa.order, // Use order as a secondary sort
          sortKey: eventDate.getTime()
        });
      }

      // Add stop departure event
      timelineEvents.push({
        type: 'departure',
        date: stop.endDate,
        title: `Departure from ${stop.city.name}`,
        city: stop.city.name,
        sortKey: stop.endDate.getTime()
      });
    }

    // Sort by time, then by order (if time is identical)
    timelineEvents.sort((a, b) => {
      if (a.sortKey !== b.sortKey) return a.sortKey - b.sortKey;
      return (a.order || 0) - (b.order || 0);
    });

    res.status(200).json({ success: true, data: timelineEvents });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getFullItinerary,
  getTripTimeline,
};
