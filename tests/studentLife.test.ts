import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { newLifeEntry, moveLifeEntry, publishStudentLife, publishedStudentLife, validateStudentLife, type StudentLifeContent, type StudentLifeRecord } from '../src/lib/studentLifeRules';
const content: StudentLifeContent = { title: 'Student life', introduction: '', hero: '', heroAlt: '', focalPoint: 'center', dayTitle: '', dayDescription: '', video: '', poster: '', videoCaption: '', statistics: [], moments: [], communities: [], facilities: [], support: [], gallery: [], faqs: [] };
const record: StudentLifeRecord = { universityId: 'u-jamk', draft: content, published: null, savedAt: '', publishedAt: null };
describe('Student Life publication rules', () => {
  it('draft content stays invisible until published', () => { assert.equal(publishedStudentLife(record, 'u-jamk', true), null); assert.equal(publishedStudentLife(publishStudentLife(record, content), 'u-jamk', true)?.title, 'Student life'); });
  it('later draft changes do not change published content', () => { const published = publishStudentLife(record, content); published.draft.title = 'New draft'; assert.equal(published.published?.title, 'Student life'); });
  it('another university cannot read this published snapshot', () => { assert.equal(publishedStudentLife(publishStudentLife(record, content), 'u-oxford', true), null); });
  it('inactive university content is hidden', () => { assert.equal(publishedStudentLife(publishStudentLife(record, content), 'u-jamk', false), null); });
  it('unpublishing hides content and retains the draft', () => { const published = publishStudentLife(record, content); const removed = { ...published, published: null }; assert.equal(publishedStudentLife(removed, 'u-jamk', true), null); assert.equal(removed.draft.title, 'Student life'); });
  it('gallery images require alt text before publishing', () => { const invalid = { ...content, gallery: [newLifeEntry({ image: '/campus.jpg' })] }; assert.throws(() => publishStudentLife(record, invalid), /alt text/); assert.equal(validateStudentLife({ ...invalid, gallery: [newLifeEntry({ image: '/campus.jpg', alt: 'Campus library' })] }).length, 0); });
  it('reordering preserves all entries and moves the selected entry', () => { assert.deepEqual(moveLifeEntry(['09:00', '12:00', '15:00'], 0, 1), ['12:00', '09:00', '15:00']); });
});
