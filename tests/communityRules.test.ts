import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { activePostCategories, visibleLearnerCommunities, communityCounts, canManageUniversity } from '../src/lib/communityRules';
describe('Communities rules', () => {
  it('hides inactive communities from learners', () => {
    assert.deepEqual(visibleLearnerCommunities([{ id:'a',active:true }, {id:'b',active:false}]).map(c=>c.id),['a']);
  });
  it('offers only active categories belonging to the community university', () => {
    assert.deepEqual(activePostCategories([{id:'campus',active:true,university_id:'jamk'},{id:'old',active:false,university_id:'jamk'},{id:'foreign',active:true,university_id:'other'}],'jamk').map(c=>c.id),['campus']);
  });
  it('restricts Organization Admin to the assigned university', () => {
    const roles=[{role:'organization_admin',university_id:'jamk'}];
    assert.equal(canManageUniversity(roles,'jamk'),true);
    assert.equal(canManageUniversity(roles,'other'),false);
  });
  it('allows Super Admin to manage all universities', () => {
    assert.equal(canManageUniversity([{role:'super_admin',university_id:null}],'other'),true);
  });
  it('does not grant learners management access', () => {
    assert.equal(canManageUniversity([{role:'learner',university_id:'jamk'}],'jamk'),false);
  });
  it('counts only real memberships and posts belonging to the selected community', () => {
    assert.deepEqual(communityCounts('a',[{community_id:'a'},{community_id:'b'}],[{community_id:'a'},{community_id:'a'},{community_id:'b'}]),{members:1,posts:2});
  });
});
