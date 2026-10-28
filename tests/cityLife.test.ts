import { describe, expect, test } from 'bun:test';
import { sampleCity, cityEntry, validateCity, isMapsUrl, moveCityEntry } from '../src/lib/cityLifeRules';
describe('City Life requirements',()=>{
  test('only Google Maps place actions may open externally',()=>{
    const c=sampleCity(); c.places[0].url='https://example.com';
    expect(validateCity(c)).toContain('Place links must point to Google Maps.');
    expect(isMapsUrl('https://www.google.com/maps/search/?api=1&query=Mikkeli')).toBe(true);
    expect(isMapsUrl('https://www.google.com.evil.com/maps')).toBe(false);
  });
  test('weather setup accepts coordinates not invented conditions',()=>{
    const c=sampleCity(); c.latitude='91'; expect(validateCity(c)).toContain('Enter valid latitude (−90 to 90) and longitude (−180 to 180).');
    c.latitude='62.2426'; c.longitude='25.7473'; expect(validateCity(c)).toEqual([]);
    expect(Object.keys(c)).not.toContain('currentTemperature');
  });
  test('gallery requires image and alt text',()=>{ const c=sampleCity();c.gallery=[cityEntry({image:'photo.jpg'})]; expect(validateCity(c)).toContain('Gallery images and alt text are required.'); });
  test('repeatable records preserve selected ordering',()=>{expect(moveCityEntry(['one','two','three'],2,0)).toEqual(['three','one','two']);});
  test('universities in the same city retain independent content',()=>{ const a=sampleCity('Mikkeli');const b=sampleCity('Mikkeli');a.faqs[0].title='Changed'; expect(b.faqs[0].title).toBe('How do students get around?'); });
  test('selected housing and appointment destinations use HTTPS',()=>{const c=sampleCity();c.housing[0].url='javascript:alert(1)';c.appointmentUrl='http://example.com';expect(validateCity(c)).toContain('Housing resources must use HTTPS.');expect(validateCity(c)).toContain('Appointment calendar must use HTTPS.');});
  test('guidance only selects visible FAQs',()=>{const c=sampleCity(); c.faqs[0].visible=false;expect(validateCity(c)).toContain('Study Guidance must reference visible FAQs.');});
});