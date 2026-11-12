import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { domainContentSamples } from '../src/lib/domainMappedContent';

describe('Domain detail reference content', () => {
  it('provides examples for all five requested content types', () => {
    assert.deepEqual([...new Set(domainContentSamples('dom-technology').map(r => r.tab))], ['Courses', 'Events', 'Podcasts', 'Blogs', 'Newsletter']);
  });
  it('keeps sample content within its assigned university', () => {
    assert.equal(domainContentSamples('dom-technology', 'u-other').length, 0);
    assert.equal(domainContentSamples('dom-technology', 'u-jamk').length, 10);
  });
  it('does not add technology samples to unrelated domains', () => {
    assert.equal(domainContentSamples('dom-business').length, 0);
  });
});