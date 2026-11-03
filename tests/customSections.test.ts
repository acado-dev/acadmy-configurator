import { describe, expect, test } from 'bun:test';
import { sampleCustomSections, validateCustomSections, validateSectionDefinition, enabledCustom, newField } from '../src/lib/customSections';
describe('Custom sections',()=>{
  const defs = sampleCustomSections();
  test('only enabled, active sections apply to a university',()=>{ expect(enabledCustom(defs,'student',[]).length).toBe(0); expect(enabledCustom(defs,'student',['alumni-stories']).length).toBe(1); const off = defs.map(d=>({...d,active:false})); expect(enabledCustom(off,'student',['alumni-stories']).length).toBe(0); });
  test('required fields block publish only when the section is enabled',()=>{ expect(validateCustomSections(defs,'student',[],{})).toEqual([]); expect(validateCustomSections(defs,'student',['alumni-stories'],{})).toContain('Alumni Stories: Introduction is required.'); expect(validateCustomSections(defs,'student',['alumni-stories'],{'alumni-stories':{intro:'Hi'}})).toEqual([]); });
  test('section definitions need a name, labelled fields and select options',()=>{ const s={...defs[0],name:'',fields:[{...newField('select'),label:''}]}; const e=validateSectionDefinition(s); expect(e).toContain('Enter a section name.'); expect(e).toContain('Field 1 needs a label.'); expect(e.some(x=>x.includes('add at least one option'))).toBe(true); });
});
