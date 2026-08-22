/**
 * Converts a "HH:MM" string to minutes since midnight for easy comparison.
 * @param {string} timeStr - The time string (e.g., "14:30")
 * @returns {number} Minutes since midnight
 */
function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours * 60) + minutes;
}

/**
 * Detects schedule conflicts within a single day.
 * A conflict occurs if the start time of an activity is strictly before the end time of the previous activity.
 * Assumes activities might not be perfectly sorted, so we sort them by start time first.
 * @param {object} day - The day object
 * @returns {Array} List of warning messages for any detected conflicts.
 */
function detectScheduleConflicts(day) {
  if (!day || !Array.isArray(day.activities) || day.activities.length < 2) {
    return [];
  }

  const warnings = [];
  
  // Create a sorted copy of activities based on suggested_time
  const sortedActivities = [...day.activities].sort((a, b) => {
    return timeToMinutes(a.suggested_time) - timeToMinutes(b.suggested_time);
  });

  for (let i = 0; i < sortedActivities.length - 1; i++) {
    const current = sortedActivities[i];
    const next = sortedActivities[i + 1];

    if (!current.suggested_time || !next.suggested_time || !current.duration_minutes) continue;

    const currentStart = timeToMinutes(current.suggested_time);
    const currentEnd = currentStart + current.duration_minutes;
    const nextStart = timeToMinutes(next.suggested_time);

    // If the next activity starts before the current one ends, it's a conflict.
    if (nextStart < currentEnd) {
      warnings.push(`Schedule conflict on Day ${day.day}: '${current.name}' overlaps with '${next.name}'.`);
    }
  }

  return warnings;
}

/**
 * Detects obvious duplicate activities across the entire itinerary.
 * @param {Array} days - The array of day objects
 * @returns {Array} List of warning messages for detected duplicates.
 */
function detectDuplicateActivities(days) {
  if (!Array.isArray(days)) return [];

  const seenActivities = new Set();
  const duplicates = new Set();
  const warnings = [];

  for (const day of days) {
    if (!Array.isArray(day.activities)) continue;
    
    for (const activity of day.activities) {
      if (!activity.name) continue;
      
      const normalizedName = activity.name.toLowerCase().trim();
      if (seenActivities.has(normalizedName)) {
        duplicates.add(activity.name);
      } else {
        seenActivities.add(normalizedName);
      }
    }
  }

  if (duplicates.size > 0) {
    warnings.push(`Duplicate activities detected: ${Array.from(duplicates).join(', ')}.`);
  }

  return warnings;
}

/**
 * Validates that the LLM generated exactly the requested number of days.
 * @param {Array} days - Generated days
 * @param {number} requestedDays - Requested days
 * @returns {boolean}
 */
function validateExactDays(days, requestedDays) {
  return Array.isArray(days) && days.length === requestedDays;
}

module.exports = {
  detectScheduleConflicts,
  detectDuplicateActivities,
  validateExactDays
};
