const prisma = require('../services/prisma');
const sharingService = require('../services/sharingService');

const getShareStatus = async (req, res, next) => {
  try {
    const tripId = req.params.id;

    // Verify ownership
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const share = await sharingService.getTripShareStatus(tripId);

    if (share && share.isPublic) {
      return res.status(200).json({
        success: true,
        data: {
          isPublic: true,
          slug: share.slug,
          publicUrl: `/api/public/trips/${share.slug}`
        }
      });
    }

    res.status(200).json({ success: true, data: { isPublic: false } });
  } catch (error) {
    next(error);
  }
};

const createShare = async (req, res, next) => {
  try {
    const tripId = req.params.id;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const share = await sharingService.createOrUpdateShare(tripId);

    res.status(200).json({
      success: true,
      data: {
        isPublic: true,
        slug: share.slug,
        publicUrl: `/api/public/trips/${share.slug}`
      }
    });
  } catch (error) {
    next(error);
  }
};

const disableShare = async (req, res, next) => {
  try {
    const tripId = req.params.id;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.ownerId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    await sharingService.disableShare(tripId);

    res.status(200).json({ success: true, message: 'Public sharing disabled' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShareStatus,
  createShare,
  disableShare,
};
