const prisma = require('../services/prisma');

const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    // Basic implementation, for example updating email
    // Additional allowed fields could go here
    const { email } = req.body;
    const dataToUpdate = {};
    if (email) dataToUpdate.email = email;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: dataToUpdate,
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};


const deleteMe = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Find all trips owned by user
    const trips = await prisma.trip.findMany({
      where: { ownerId: userId },
      select: { id: true }
    });

    const tripIds = trips.map(t => t.id);

    // Delete cascading manually
    await prisma.$transaction(async (tx) => {
      if (tripIds.length > 0) {
        await tx.stopActivity.deleteMany({ where: { tripStop: { tripId: { in: tripIds } } } });
        await tx.tripStop.deleteMany({ where: { tripId: { in: tripIds } } });
        await tx.budgetItem.deleteMany({ where: { tripId: { in: tripIds } } });
        await tx.sharedTrip.deleteMany({ where: { tripId: { in: tripIds } } });
        await tx.trip.deleteMany({ where: { ownerId: userId } });
      }
      await tx.user.delete({ where: { id: userId } });
    });

    res.status(200).json({ success: true, message: 'User account deleted successfully' });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getMe,
  updateMe,
  deleteMe,
};
