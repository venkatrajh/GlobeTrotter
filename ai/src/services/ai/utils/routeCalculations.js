/**
 * Deterministically computes the total travel time for a day based strictly on travel_metadata.
 * If travel metadata for a specific route (A -> B) is absent, it adds 0 to the sum, 
 * explicitly refusing to hallucinate distances.
 * 
 * @param {Array} activities - Array of activity objects for a single day
 * @param {Array} travelMetadata - Array of TravelMetadataSchema objects
 * @returns {number} The total estimated travel minutes
 */
function calculateDayTravelMinutes(activities, travelMetadata = []) {
  if (!activities || activities.length < 2) return 0;
  
  let totalMinutes = 0;
  for (let i = 0; i < activities.length - 1; i++) {
    const fromId = activities[i].id;
    const toId = activities[i+1].id;
    
    if (fromId && toId) {
      const route = travelMetadata.find(
        t => t.from_activity_id === fromId && t.to_activity_id === toId
      );
      if (route && typeof route.estimated_minutes === 'number') {
        totalMinutes += route.estimated_minutes;
      }
    }
  }
  return totalMinutes;
}

/**
 * Calculates travel time for an entire itinerary.
 */
function calculateItineraryTravelMinutes(itinerary, travelMetadata = []) {
  if (!itinerary || !Array.isArray(itinerary.days)) return 0;
  
  return itinerary.days.reduce((total, day) => {
    return total + calculateDayTravelMinutes(day.activities, travelMetadata);
  }, 0);
}

/**
 * Validates that no activities were illegally moved across days or deleted entirely.
 */
function validateActivitiesIntact(originalDay, optimizedDay) {
  if (!originalDay || !optimizedDay) return false;
  
  const originalIds = (originalDay.activities || []).map(a => a.id).sort();
  const optimizedIds = (optimizedDay.activities || []).map(a => a.id).sort();
  
  if (originalIds.length !== optimizedIds.length) return false;
  
  for (let i = 0; i < originalIds.length; i++) {
    if (originalIds[i] !== optimizedIds[i]) return false;
  }
  return true;
}

/**
 * Checks if fixed time activities were illegally shifted.
 */
function validateFixedTimes(originalDay, optimizedDay, fixedTimeIds = []) {
  if (fixedTimeIds.length === 0) return true;
  
  for (const act of (originalDay.activities || [])) {
    if (fixedTimeIds.includes(act.id)) {
      const optAct = (optimizedDay.activities || []).find(a => a.id === act.id);
      if (!optAct || optAct.suggested_time !== act.suggested_time) {
        return false;
      }
    }
  }
  return true;
}

module.exports = {
  calculateDayTravelMinutes,
  calculateItineraryTravelMinutes,
  validateActivitiesIntact,
  validateFixedTimes
};
