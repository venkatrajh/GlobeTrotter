const { 
  calculateDayTravelMinutes, 
  validateActivitiesIntact,
  validateFixedTimes
} = require('../../src/services/ai/utils/routeCalculations');

describe('Route Calculations', () => {
  it('should calculate day travel minutes strictly based on metadata', () => {
    const activities = [{ id: 'a1' }, { id: 'a2' }, { id: 'a3' }];
    const meta = [
      { from_activity_id: 'a1', to_activity_id: 'a2', estimated_minutes: 15 },
      { from_activity_id: 'a2', to_activity_id: 'a3', estimated_minutes: 20 }
    ];
    
    expect(calculateDayTravelMinutes(activities, meta)).toBe(35);
  });

  it('should return 0 when metadata is missing', () => {
    const activities = [{ id: 'a1' }, { id: 'a2' }];
    expect(calculateDayTravelMinutes(activities, [])).toBe(0);
  });

  it('should validate activities intact', () => {
    const orig = { activities: [{ id: 'a1' }, { id: 'a2' }] };
    const optValid = { activities: [{ id: 'a2' }, { id: 'a1' }] };
    const optInvalid = { activities: [{ id: 'a1' }, { id: 'a3' }] };
    const optMissing = { activities: [{ id: 'a1' }] };

    expect(validateActivitiesIntact(orig, optValid)).toBe(true);
    expect(validateActivitiesIntact(orig, optInvalid)).toBe(false);
    expect(validateActivitiesIntact(orig, optMissing)).toBe(false);
  });

  it('should validate fixed times', () => {
    const orig = { activities: [{ id: 'a1', suggested_time: '09:00' }] };
    const optValid = { activities: [{ id: 'a1', suggested_time: '09:00' }] };
    const optInvalid = { activities: [{ id: 'a1', suggested_time: '10:00' }] };
    
    expect(validateFixedTimes(orig, optValid, ['a1'])).toBe(true);
    expect(validateFixedTimes(orig, optInvalid, ['a1'])).toBe(false);
  });
});
