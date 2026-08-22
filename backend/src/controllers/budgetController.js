const prisma = require('../services/prisma');
const { calculateBudgetSummary } = require('../services/budgetService');

const getTripBudget = async (req, res, next) => {
  try {
    const { id: tripId } = req.params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const items = await prisma.budgetItem.findMany({
      where: { tripId },
      orderBy: { createdAt: 'asc' },
    });

    const summary = calculateBudgetSummary(items);

    res.status(200).json({
      success: true,
      data: {
        tripId,
        total: summary.total,
        breakdown: summary.breakdown,
        items,
      }
    });
  } catch (error) {
    next(error);
  }
};

const createBudgetItem = async (req, res, next) => {
  try {
    const { id: tripId } = req.params;
    const { amount, category, description } = req.body;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const item = await prisma.budgetItem.create({
      data: {
        tripId,
        amount,
        category,
        description,
      }
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const getBudgetItems = async (req, res, next) => {
  try {
    const { id: tripId } = req.params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const items = await prisma.budgetItem.findMany({
      where: { tripId },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

const updateBudgetItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { amount, category, description } = req.body;

    const existing = await prisma.budgetItem.findUnique({
      where: { id: itemId },
      include: { trip: true }
    });

    if (!existing || existing.trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Budget item not found' });
    }

    const item = await prisma.budgetItem.update({
      where: { id: itemId },
      data: {
        amount: amount !== undefined ? amount : undefined,
        category: category !== undefined ? category : undefined,
        description: description !== undefined ? description : undefined,
      }
    });

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const deleteBudgetItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const existing = await prisma.budgetItem.findUnique({
      where: { id: itemId },
      include: { trip: true }
    });

    if (!existing || existing.trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Budget item not found' });
    }

    await prisma.budgetItem.delete({ where: { id: itemId } });
    res.status(200).json({ success: true, message: 'Budget item deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTripBudget,
  createBudgetItem,
  getBudgetItems,
  updateBudgetItem,
  deleteBudgetItem,
};
