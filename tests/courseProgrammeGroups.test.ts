import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveProgrammeGroups } from '../src/lib/courseDetails';

describe('Simplified programme content', () => {
  it('creates exactly Learn, Apply and Grow groups', () => {
    assert.deepEqual(resolveProgrammeGroups({}).map(g => [g.key, g.subheader, g.points]), [
      ['learn', 'Learn', []], ['apply', 'Apply', []], ['grow', 'Grow', []],
    ]);
  });
  it('consolidates legacy benefits, outcomes and skills without mutating saved content', () => {
    const legacy = {
      benefits: [{ id: '1', title: 'Learn', description: 'Research methods', icon: '/learn.jpg' }, { id: '2', title: 'Apply', description: 'Industry practice' }, { id: '3', title: 'Build your future', description: 'Leadership' }, { id: '4', title: 'Networking', description: 'Meet industry partners' }],
      outcomeBullets: ['Solve business problems'], skills: [{ id: 's', title: 'Analysis', description: 'Interpret findings' }],
    };
    const original = structuredClone(legacy);
    const groups = resolveProgrammeGroups(legacy);
    assert.deepEqual(groups[0].points, ['Research methods', 'Solve business problems']);
    assert.deepEqual(groups[1].points, ['Industry practice', 'Analysis: Interpret findings']);
    assert.deepEqual(groups[2].points, ['Leadership', 'Networking: Meet industry partners']);
    assert.equal(groups[2].subheader, 'Build your future');
    assert.equal(groups[0].image, '/learn.jpg');
    assert.deepEqual(legacy, original);
  });
  it('does not resurrect removed points from legacy data', () => {
    const groups = resolveProgrammeGroups({ outcomeBullets: ['Deleted point'], programmeGroups: [{ key: 'learn', subheader: 'Learn', points: [] }] });
    assert.deepEqual(groups[0].points, []);
  });
  it('keeps group content and images independent and only Grow configurable', () => {
    const groups = resolveProgrammeGroups({ programmeGroups: [
      { key: 'learn', subheader: 'Unexpected', points: ['Learn point'], image: '/learn.png' },
      { key: 'apply', subheader: 'Unexpected', points: ['Apply point'], image: '/apply.png' },
      { key: 'grow', subheader: 'Thrive', points: ['Grow point'], image: '/grow.png' },
    ] });
    assert.deepEqual(groups.map(g => g.subheader), ['Learn', 'Apply', 'Thrive']);
    assert.deepEqual(groups.map(g => g.points), [['Learn point'], ['Apply point'], ['Grow point']]);
    assert.deepEqual(groups.map(g => g.image), ['/learn.png', '/apply.png', '/grow.png']);
  });
});