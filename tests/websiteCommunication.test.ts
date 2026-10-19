import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { contactSchema, eligibleSubscribers, subscriberSchema, recordSubscription, getSubscribers, unsubscribe, Subscriber } from '../src/lib/websiteCommunication';

describe('Newsletter consent rules', () => {
  it('requires explicit confirmation before accepting a subscription', () => {
    assert.equal(subscriberSchema.safeParse({ email: 'learner@example.com', source: 'Website checkbox', consent: false }).success, false);
    assert.equal(subscriberSchema.safeParse({ email: 'learner@example.com', source: 'Website checkbox', consent: true }).success, true);
  });
  it('allows only active consented non-sample subscribers to receive a newsletter', () => {
    const base: Subscriber = { id: '1', name: 'Learner', email: 'learner@example.com', status: 'Subscribed', consentAt: '2026-10-19T00:00:00Z', consentSource: 'Website confirmation', updatedAt: '2026-10-19T00:00:00Z' };
    assert.deepEqual(eligibleSubscribers([base, { ...base, id: '2', status: 'Unsubscribed' }, { ...base, id: '3', consentAt: null }, { ...base, id: '4', sample: true }, { ...base, id: '5', consentSource: '' }]).map(s => s.id), ['1']);
  });
  it('rejects unconfirmed consent without writing and excludes a withdrawn subscription', () => {
    const values = new Map<string, string>();
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) } });
    values.set('acado_newsletter_subscribers', '[]');
    assert.throws(() => recordSubscription({ email: 'person@example.com', consent: false, source: 'Form' }));
    assert.equal(getSubscribers().length, 0);
    const added = recordSubscription({ email: 'PERSON@example.com', consent: true, source: 'Explicit website confirmation' });
    assert.equal(added.email, 'person@example.com');
    assert.throws(() => recordSubscription({ email: 'person@example.com', consent: true, source: 'Form' }));
    unsubscribe(added.id);
    assert.equal(getSubscribers().length, 1);
    assert.equal(eligibleSubscribers(getSubscribers()).length, 0);
  });
});
describe('Contact query types', () => {
  it('requires a university name for university representatives but not individuals', () => {
    const base = { firstName: 'Aisha', lastName: 'Sharma', email: 'aisha@example.com', phone: '+91 9000000001', query: 'Application question' };
    assert.equal(contactSchema.safeParse({ ...base, userType: 'University representative', university: '' }).success, false);
    assert.equal(contactSchema.safeParse({ ...base, userType: 'University representative', university: 'University' }).success, true);
    assert.equal(contactSchema.safeParse({ ...base, userType: 'Student / Individual' }).success, true);
  });
});