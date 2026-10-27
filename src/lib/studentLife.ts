import campus from '@/assets/student-life-campus.jpg';
import { newLifeEntry, type StudentLifeContent, type StudentLifeRecord } from './studentLifeRules';
const KEY = 'acado_student_life_prototype';
export function sampleStudentLife(name: string): StudentLifeContent {
  const entry = (title: string, description: string, rest = {}) => newLifeEntry({ title, description, ...rest });
  return {
    title: `Student life at ${name}`, introduction: 'Communities, campus facilities and support that help you feel at home from your first week.',
    hero: campus, heroAlt: 'Students working together in a bright campus library', focalPoint: 'center',
    dayTitle: 'A day in the life', dayDescription: 'From morning lectures to evening club meetings — a typical day on campus.', video: '', poster: campus, videoCaption: 'Campus life — sample feature',
    statistics: [entry('Campus cities', '', { value: '2', context: 'Sample campus overview' }), entry('Student clubs', '', { value: '18', context: 'Sample student activities' })],
    moments: [entry('Lectures & project work', 'Hands-on teaching in small groups.', { time: '09:00' }), entry('Lunch at the student restaurant', 'Meet friends over lunch.', { time: '12:00' }), entry('Library & group study', 'Work together in a quiet study space.', { time: '15:00' }), entry('Club activities & sports', 'Make time for your interests.', { time: '18:00' })],
    communities: [entry('Student union', 'Student representation, campus activities and support.', { category: 'Union', image: campus, alt: 'Students connecting on campus', destination: '/user/communities', time: 'Weekly meetups' }), entry('Clubs & associations', 'Find your people in subject societies and hobby clubs.', { category: 'Clubs', image: campus, alt: 'A student study group', destination: '/user/communities' }), entry('Career opportunities', 'Explore programmes and build your next chapter.', { category: 'Opportunities', image: campus, alt: 'Students collaborating on a project', destination: '/user/courses' })],
    facilities: [entry('Library & study spaces', 'Quiet zones, group rooms and learning resources.', { category: 'Study', location: 'Main campus', hours: 'Sample: Mon–Fri, 08:00–18:00' }), entry('Student restaurant', 'A welcoming place for lunch with friends.', { category: 'Dining', location: 'Main campus', hours: 'Sample: Mon–Fri, 11:00–14:00' }), entry('Sports & wellbeing', 'Campus sports sessions and fitness spaces.', { category: 'Sports', location: 'Sports centre' }), entry('Project labs', 'Spaces for practical and applied learning.', { category: 'Learning', location: 'Technology campus' })],
    support: [entry('Student healthcare', 'Healthcare guidance and support for students.', { category: 'Healthcare', location: 'Student services' }), entry('Counselling & wellbeing', 'Support with stress, motivation and personal wellbeing.', { category: 'Counselling' }), entry('Accessibility', 'Individual study arrangements and accessible learning.', { category: 'Accessibility' }), entry('Study guidance', 'Plan your studies and get help with your progress.', { category: 'Study guidance' })],
    gallery: [entry('', '', { image: campus, alt: 'University students sharing ideas in the library', caption: 'Study together', category: 'Campus' })],
    faqs: [entry('How do I meet other students?', 'Join student clubs, take part in orientation and explore campus communities.', { category: 'Communities' }), entry('Is there support for international students?', 'Student services can help with settling in and planning your studies.', { category: 'Support' }), entry('Where can I eat on campus?', 'Visit the student restaurant and check its opening hours.', { category: 'Facilities' })],
  };
}
export function readLifeRecords(): Record<string, StudentLifeRecord> {
  const raw = localStorage.getItem(KEY); if (!raw) return {};
  try { return JSON.parse(raw); } catch { throw new Error('Student Life data could not be loaded.'); }
}
export function loadStudentLife(id: string, name: string): StudentLifeRecord {
  const records = readLifeRecords(); if (records[id]) return records[id];
  const record: StudentLifeRecord = { universityId: id, draft: sampleStudentLife(name), published: null, savedAt: new Date().toISOString(), publishedAt: null };
  saveStudentLife(record); return record;
}
export function saveStudentLife(record: StudentLifeRecord) {
  const records = readLifeRecords(); records[record.universityId] = record; localStorage.setItem(KEY, JSON.stringify(records));
}
