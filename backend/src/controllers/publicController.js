const sharingService = require('../services/sharingService');

const getPublicTrip = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const itinerary = await sharingService.getPublicItinerary(slug);

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Public trip not found' });
    }

    res.status(200).json({
      success: true,
      data: itinerary,
    });
  } catch (error) {
    next(error);
  }
};


const prisma = require('../services/prisma');

const copyPublicTrip = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const sharedTrip = await prisma.sharedTrip.findUnique({ where: { slug } });
    if (!sharedTrip || !sharedTrip.isPublic) {
      return res.status(404).json({ success: false, message: 'Public trip not found' });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: sharedTrip.tripId },
      include: {
        stops: {
          include: { activities: true }
        },
        budgetItems: true,
      }
    });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Source trip not found' });
    }

    // Perform deep copy in transaction
    const newTrip = await prisma.$transaction(async (tx) => {
      const createdTrip = await tx.trip.create({
        data: {
          title: `Copy of ${trip.title}`,
          description: trip.description,
          startDate: trip.startDate,
          endDate: trip.endDate,
          destination: trip.destination,
          ownerId: req.userId,
        }
      });

      for (const stop of trip.stops) {
        const createdStop = await tx.tripStop.create({
          data: {
            tripId: createdTrip.id,
            cityId: stop.cityId,
            startDate: stop.startDate,
            endDate: stop.endDate,
            order: stop.order,
          }
        });

        for (const sa of stop.activities) {
          await tx.stopActivity.create({
            data: {
              tripStopId: createdStop.id,
              activityId: sa.activityId,
              scheduledDate: sa.scheduledDate,
              order: sa.order,
              notes: sa.notes,
            }
          });
        }
      }

      for (const bi of trip.budgetItems) {
        await tx.budgetItem.create({
          data: {
            tripId: createdTrip.id,
            amount: bi.amount,
            category: bi.category,
            description: bi.description,
          }
        });
      }

      return createdTrip;
    });

    res.status(201).json({ success: true, data: newTrip, message: 'Trip copied successfully' });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getPublicTrip,
  copyPublicTrip,
};
