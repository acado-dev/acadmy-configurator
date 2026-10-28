export const cityCollections = ['facts', 'seasons', 'places', 'housing', 'gallery', 'faqs'] as const;
export type CityCollection = typeof cityCollections[number];
export interface CityEntry {
  id: string; title: string; description: string; category: string; value: string; unit: string;
  context: string; months: string; temperature: string; address: string; distance: string;
  image: string; alt: string; caption: string; url: string; notes: string; action: string; visible: boolean;
}
export interface CityContent {
  title: string; city: string; country: string; introduction: string; hero: string; heroAlt: string;
  focalPoint: string; thumbnail: string; campus: string; latitude: string; longitude: string;
  weatherLabel: string; weatherEnabled: boolean; guidanceHeading: string; guidanceDescription: string;
  aiEnabled: boolean; managerLabel: string; appointmentUrl: string; guidanceFaqIds: string[];
  facts: CityEntry[]; seasons: CityEntry[]; places: CityEntry[]; housing: CityEntry[]; gallery: CityEntry[]; faqs: CityEntry[];
}
export function cityEntry(values: Partial<CityEntry> = {}): CityEntry {
  return { id: crypto.randomUUID(), title: '', description: '', category: '', value: '', unit: '', context: '', months: '', temperature: '', address: '', distance: '', image: '', alt: '', caption: '', url: '', notes: '', action: '', visible: true, ...values };
}
export function sampleCity(city = 'Jyväskylä', country = 'Finland'): CityContent {
  const faq = cityEntry({ title: 'How do students get around?', description: 'Local buses and cycling connect campuses with the city centre. Confirm routes and student fares before travelling.', category: 'transport' });
  return {
    title: `Living in ${city}`, city, country, introduction: 'A lakeside student city with green surroundings and everyday essentials close by.', hero: '', heroAlt: '', focalPoint: 'center', thumbnail: '', campus: 'University campus and city centre', latitude: '62.2426', longitude: '25.7473', weatherLabel: city, weatherEnabled: true,
    guidanceHeading: 'Get help planning your studies', guidanceDescription: 'Explore city-life FAQs or arrange a conversation about your next steps.', aiEnabled: false, managerLabel: 'Talk to a Study Manager', appointmentUrl: '', guidanceFaqIds: [faq.id],
    facts: [cityEntry({ title: 'Average rent', value: '350–650', unit: 'EUR / month', context: 'Sample planning estimate; confirm with housing providers' }), cityEntry({ title: 'Getting around', value: 'Bus & bicycle', context: 'Sample overview' })],
    seasons: [cityEntry({ title: 'Winter', months: 'December–February', temperature: '−15 to −5°C', description: 'Short days, snow and opportunities for winter activities.' }), cityEntry({ title: 'Spring', months: 'March–May', temperature: '0 to 15°C', description: 'Longer days and melting lakes.' }), cityEntry({ title: 'Summer', months: 'June–August', temperature: '15 to 25°C', description: 'Bright evenings and lakeside walks.' }), cityEntry({ title: 'Autumn', months: 'September–November', temperature: '0 to 12°C', description: 'Colourful forests and crisp air.' })],
    places: [cityEntry({ title: 'Travel centre', category: 'transport', description: 'Rail and bus connections for regional journeys.', address: `${city} city centre`, distance: 'Confirm from your campus', url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city + ' travel centre')}` }), cityEntry({ title: 'Lakeside walking paths', category: 'student-friendly', description: 'Walking and cycling beside the lake.', address: city, distance: 'Varies by campus', url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city + ' lakeside')}` })],
    housing: [cityEntry({ title: 'Student apartments', description: 'Shared apartments and studios for students.', value: 'Confirm current prices with the provider', notes: 'Eligibility and availability depend on the provider.', action: 'View housing resource' })], gallery: [], faqs: [faq, cityEntry({ title: 'When should I look for accommodation?', description: 'Start early once your study plans are confirmed. Availability changes around the beginning of each term.', category: 'accommodation' })],
  };
}
export function isHttpsUrl(value: string): boolean { try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password; } catch { return false; } }
export function isMapsUrl(value: string): boolean {
  if (!isHttpsUrl(value)) return false;
  const u = new URL(value);
  return u.hostname === 'maps.app.goo.gl' || u.hostname === 'maps.google.com' || (['google.com', 'www.google.com'].includes(u.hostname) && (u.pathname === '/maps' || u.pathname.startsWith('/maps/')));
}
export function moveCityEntry<T>(entries: T[], from: number, to: number): T[] {
  if (from < 0 || to < 0 || from >= entries.length || to >= entries.length) return entries;
  const next = [...entries]; const [entry] = next.splice(from, 1); next.splice(to, 0, entry); return next;
}
export function validateCity(content: CityContent): string[] {
  const errors: string[] = [];
  if (!content.title.trim() || !content.city.trim() || !content.country.trim()) errors.push('Page title, city and country are required.');
  if (content.hero && !content.heroAlt.trim()) errors.push('Hero image alt text is required.');
  if (content.weatherEnabled && (content.latitude.trim() === '' || content.longitude.trim() === '' || !Number.isFinite(Number(content.latitude)) || !Number.isFinite(Number(content.longitude)) || Math.abs(Number(content.latitude)) > 90 || Math.abs(Number(content.longitude)) > 180)) errors.push('Enter valid latitude (−90 to 90) and longitude (−180 to 180).');
  for (const key of cityCollections) content[key].filter(e => e.visible).forEach(e => {
    if (key !== 'gallery' && !e.title.trim()) errors.push(`${key}: visible entries need a title.`);
    if (e.image && !e.alt.trim()) errors.push(`${key}: add image alt text.`);
    if (key === 'gallery' && (!e.image || !e.alt.trim())) errors.push('Gallery images and alt text are required.');
    if (key === 'faqs' && !e.description.trim()) errors.push('FAQs need an answer.');
    if (key === 'facts' && !e.value.trim()) errors.push('Fact cards need a value.');
    if (key === 'places' && e.url && !isMapsUrl(e.url)) errors.push('Place links must point to Google Maps.');
    if (key === 'housing' && e.url && !isHttpsUrl(e.url)) errors.push('Housing resources must use HTTPS.');
  });
  if (content.appointmentUrl && !isHttpsUrl(content.appointmentUrl)) errors.push('Appointment calendar must use HTTPS.');
  if (content.guidanceFaqIds.some(id => !content.faqs.some(f => f.id === id && f.visible))) errors.push('Study Guidance must reference visible FAQs.');
  return [...new Set(errors)];
}