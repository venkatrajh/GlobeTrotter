const { detectScheduleConflicts, detectDuplicateActivities, validateExactDays } = require('../../src/services/ai/utils/itineraryValidation');

describe('Itinerary Validation', () => {
  describe('detectScheduleConflicts', () => {
    it('should detect conflicting times', () => {
      const day = {
        day: 1,
        activities: [
          { name: 'Act 1', suggested_time: '10:00', duration_minutes: 120 }, // Ends 12:00
          { name: 'Act 2', suggested_time: '11:00', duration_minutes: 60 }   // Starts 11:00 (Conflict)
        ]
      };
      const warnings = detectScheduleConflicts(day);
      expect(warnings.length).toBe(1);
      expect(warnings[0]).toContain('overlaps');
    });

    it('should not flag non-conflicting times', () => {
      const day = {
        day: 1,
        activities: [
          { name: 'Act 1', suggested_time: '10:00', duration_minutes: 120 }, // Ends 12:00
          { name: 'Act 2', suggested_time: '12:30', duration_minutes: 60 }   // Starts 12:30 (Ok)
        ]
      };
      const warnings = detectScheduleConflicts(day);
      expect(warnings.length).toBe(0);
    });
  });

  describe('detectDuplicateActivities', () => {
    it('should detect exact name matches (case insensitive)', () => {
      const days = [
        { activities: [{ name: 'Tokyo Tower' }] },
        { activities: [{ name: 'tokyo tower ' }] }
      ];
      const warnings = detectDuplicateActivities(days);
      expect(warnings.length).toBe(1);
      expect(warnings[0]).toContain('Duplicate activities detected');
    });

    it('should not flag unique activities', () => {
      const days = [
        { activities: [{ name: 'Tokyo Tower' }] },
        { activities: [{ name: 'Skytree' }] }
      ];
      const warnings = detectDuplicateActivities(days);
      expect(warnings.length).toBe(0);
    });
  });

  describe('validateExactDays', () => {
    it('should return true for exact match', () => {
      expect(validateExactDays([{}, {}, {}], 3)).toBe(true);
    });

    it('should return false for mismatch', () => {
      expect(validateExactDays([{}, {}], 3)).toBe(false);
    });
  });
});
