import { describe, expect, test } from 'bun:test';
import { emptyUniversityProfile, resolveUniversityProfileId, updateUniversityProfiles } from './universityProfile';

describe('University administrator profile editing', () => {
  test('resolves the administrator’s own university, not another institution', () => {
    expect(resolveUniversityProfileId({ universityId: 'u-jamk' })).toBe('u-jamk');
    expect(resolveUniversityProfileId(null)).toBeNull();
  });
  test('updates JAMK without changing another university', () => {
    const jamk = emptyUniversityProfile('u-jamk', 'Jamk');
    const oxford = emptyUniversityProfile('u-oxford', 'Oxford');
    const updated = updateUniversityProfiles([jamk, oxford], { ...jamk, admission: 'Updated admission information' });
    expect(updated.find(profile => profile.id === 'u-jamk')?.admission).toBe('Updated admission information');
    expect(updated.find(profile => profile.id === 'u-oxford')).toEqual(oxford);
  });
});