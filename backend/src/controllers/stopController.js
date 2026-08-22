const prisma = require('../services/prisma');

const createTripStop = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { cityId, startDate, endDate, order } = req.body;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const city = await prisma.city.findUnique({ where: { id: cityId } });
    if (!city) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    const stopStart = new Date(startDate);
    const stopEnd = new Date(endDate);

    if (stopStart < trip.startDate || stopEnd > trip.endDate) {
      return res.status(400).json({ success: false, message: 'Stop dates must be within trip dates' });
    }

    const stop = await prisma.tripStop.create({
      data: {
        tripId,
        cityId,
        startDate: stopStart,
        endDate: stopEnd,
        order,
      }
    });

    res.status(201).json({ success: true, data: stop });
  } catch (error) {
    next(error);
  }
};

const getTripStops = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const stops = await prisma.tripStop.findMany({
      where: { tripId },
      orderBy: { order: 'asc' },
      include: { city: true },
    });

    res.status(200).json({ success: true, data: stops });
  } catch (error) {
    next(error);
  }
};

const updateTripStop = async (req, res, next) => {
  try {
    const { stopId } = req.params;
    const { startDate, endDate, order } = req.body;

    const existing = await prisma.tripStop.findUnique({
      where: { id: stopId },
      include: { trip: true }
    });

    if (!existing || existing.trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Stop not found' });
    }

    const newStart = startDate ? new Date(startDate) : existing.startDate;
    const newEnd = endDate ? new Date(endDate) : existing.endDate;

    if (newStart < existing.trip.startDate || newEnd > existing.trip.endDate) {
      return res.status(400).json({ success: false, message: 'Stop dates must be within trip dates' });
    }
    if (newStart > newEnd) {
      return res.status(400).json({ success: false, message: 'End date cannot be before start date' });
    }

    const stop = await prisma.tripStop.update({
      where: { id: stopId },
      data: {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        order,
      }
    });

    res.status(200).json({ success: true, data: stop });
  } catch (error) {
    next(error);
  }
};

const deleteTripStop = async (req, res, next) => {
  try {
    const { stopId } = req.params;

    const existing = await prisma.tripStop.findUnique({
      where: { id: stopId },
      include: { trip: true }
    });

    if (!existing || existing.trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Stop not found' });
    }

    await prisma.$transaction([
      prisma.stopActivity.deleteMany({ where: { tripStopId: stopId } }),
      prisma.tripStop.delete({ where: { id: stopId } })
    ]);
    res.status(200).json({ success: true, message: 'Stop deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTripStop,
  getTripStops,
  updateTripStop,
  deleteTripStop,
};
