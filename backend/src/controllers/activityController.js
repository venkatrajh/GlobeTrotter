const prisma = require('../services/prisma');

const createStopActivity = async (req, res, next) => {
  try {
    const { stopId } = req.params;
    const { activityId, scheduledDate, order, notes } = req.body;

    const stop = await prisma.tripStop.findUnique({
      where: { id: stopId },
      include: { trip: true }
    });

    if (!stop || stop.trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Stop not found' });
    }

    const activity = await prisma.activity.findUnique({ where: { id: activityId } });
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    const stopActivity = await prisma.stopActivity.create({
      data: {
        tripStopId: stopId,
        activityId,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        order,
        notes,
      }
    });

    res.status(201).json({ success: true, data: stopActivity });
  } catch (error) {
    next(error);
  }
};

const getStopActivities = async (req, res, next) => {
  try {
    const { stopId } = req.params;

    const stop = await prisma.tripStop.findUnique({
      where: { id: stopId },
      include: { trip: true }
    });

    if (!stop || stop.trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Stop not found' });
    }

    const activities = await prisma.stopActivity.findMany({
      where: { tripStopId: stopId },
      orderBy: { order: 'asc' },
      include: { activity: true },
    });

    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    next(error);
  }
};

const updateStopActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { scheduledDate, order, notes } = req.body;

    const existing = await prisma.stopActivity.findUnique({
      where: { id },
      include: { tripStop: { include: { trip: true } } }
    });

    if (!existing || existing.tripStop.trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    const stopActivity = await prisma.stopActivity.update({
      where: { id },
      data: {
        scheduledDate: scheduledDate !== undefined ? (scheduledDate ? new Date(scheduledDate) : null) : undefined,
        order,
        notes,
      }
    });

    res.status(200).json({ success: true, data: stopActivity });
  } catch (error) {
    next(error);
  }
};

const deleteStopActivity = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.stopActivity.findUnique({
      where: { id },
      include: { tripStop: { include: { trip: true } } }
    });

    if (!existing || existing.tripStop.trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    await prisma.stopActivity.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Activity deleted successfully' });
  } catch (error) {
    next(error);
  }
};


const getAllActivities = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const cityId = req.query.cityId || null;
    const category = req.query.category || null;

    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (cityId) where.cityId = cityId;
    if (category && category !== 'All') where.category = category;

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: { city: true }
      }),
      prisma.activity.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: activities,
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

const getActivityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: { city: true }
    });

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
};


module.exports = { createStopActivity, getStopActivities, updateStopActivity, deleteStopActivity, getAllActivities, getActivityById };
