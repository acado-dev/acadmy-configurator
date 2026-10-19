import { describe, it as test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyUniversityProfile, resolveUniversityProfileId, updateUniversityProfiles } from '../src/lib/universityProfile';

describe('University administrator profile editing', () => {
  test('resolves the administrator’s own university, not another institution', () => {
    assert.equal(resolveUniversityProfileId({ universityId: 'u-jamk' }), 'u-jamk');
    assert.equal(resolveUniversityProfileId(null), null);
  });
  test('updates JAMK without changing another university', () => {
    const jamk = emptyUniversityProfile('u-jamk', 'Jamk');
    const oxford = emptyUniversityProfile('u-oxford', 'Oxford');
    const updated = updateUniversityProfiles([jamk, oxford], { ...jamk, admission: 'Updated admission information' });
    assert.equal(updated.find(profile => profile.id === 'u-jamk')?.admission, 'Updated admission information');
    assert.deepEqual(updated.find(profile => profile.id === 'u-oxford'), oxford);
  });
});