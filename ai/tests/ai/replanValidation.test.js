const {
  validateMustKeepActivities,
  findRemovedActivities,
  findAddedActivities,
  findPreservedActivities
} = require('../../src/services/ai/utils/replanValidation');

describe('Replan Validation', () => {
  const original = {
    days: [
      { activities: [{ id: 'a1' }, { id: 'a2' }, { id: 'a3' }] }
    ]
  };

  const replanned = {
    days: [
      { activities: [{ id: 'a1' }, { id: 'a3' }, { id: 'a4' }] } // a2 removed, a4 added
    ]
  };

  it('should accurately find removed activities', () => {
    const removed = findRemovedActivities(original, replanned);
    expect(removed).toContain('a2');
    expect(removed.length).toBe(1);
  });

  it('should accurately find added activities', () => {
    const added = findAddedActivities(original, replanned);
    expect(added).toContain('a4');
    expect(added.length).toBe(1);
  });

  it('should accurately find preserved activities', () => {
    const preserved = findPreservedActivities(original, replanned);
    expect(preserved).toContain('a1');
    expect(preserved).toContain('a3');
    expect(preserved.length).toBe(2);
  });

  it('should flag must-keep constraint violations', () => {
    expect(validateMustKeepActivities(original, replanned, ['a1'])).toBe(true); // Kept
    expect(validateMustKeepActivities(original, replanned, ['a2'])).toBe(false); // Removed illegally
    expect(validateMustKeepActivities(original, replanned, [])).toBe(true); // No constraints
  });
});
