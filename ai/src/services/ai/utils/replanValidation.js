/**
 * Extracts a flat array of all activity IDs from an itinerary.
 */
function extractActivityIds(itinerary) {
  const ids = [];
  if (!itinerary || !Array.isArray(itinerary.days)) return ids;
  
  for (const day of itinerary.days) {
    if (Array.isArray(day.activities)) {
      for (const act of day.activities) {
        if (act.id) ids.push(act.id);
      }
    }
  }
  return ids;
}

/**
 * Validates if the replanned itinerary illegally removed any must-keep activities.
 * Returns true if valid (no must-keep removed), false otherwise.
 */
function validateMustKeepActivities(original, replanned, mustKeepIds = []) {
  if (mustKeepIds.length === 0) return true;
  
  const replannedIds = new Set(extractActivityIds(replanned));
  const originalIds = new Set(extractActivityIds(original));
  
  for (const id of mustKeepIds) {
    // If it was in the original but is missing from replanned, that's a violation
    if (originalIds.has(id) && !replannedIds.has(id)) {
      console.warn(`[Auto-Replanner] Constraint Conflict: Must-keep activity ${id} was removed.`);
      return false;
    }
  }
  return true;
}

/**
 * Finds all activity IDs that were in the original but are missing in the replanned.
 */
function findRemovedActivities(original, replanned) {
  const originalIds = new Set(extractActivityIds(original));
  const replannedIds = new Set(extractActivityIds(replanned));
  
  return Array.from(originalIds).filter(id => !replannedIds.has(id));
}

/**
 * Finds all activity IDs that are in the replanned but were not in the original.
 */
function findAddedActivities(original, replanned) {
  const originalIds = new Set(extractActivityIds(original));
  const replannedIds = new Set(extractActivityIds(replanned));
  
  return Array.from(replannedIds).filter(id => !originalIds.has(id));
}

/**
 * Finds all activity IDs that exist in both itineraries.
 */
function findPreservedActivities(original, replanned) {
  const originalIds = new Set(extractActivityIds(original));
  const replannedIds = new Set(extractActivityIds(replanned));
  
  return Array.from(originalIds).filter(id => replannedIds.has(id));
}

module.exports = {
  extractActivityIds,
  validateMustKeepActivities,
  findRemovedActivities,
  findAddedActivities,
  findPreservedActivities
};
