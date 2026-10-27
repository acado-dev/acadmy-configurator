import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { readLifeRecords } from '@/lib/studentLife';
import { publishedStudentLife, type StudentLifeContent } from '@/lib/studentLifeRules';
import type { UniversityDetails } from '@/types/university';
import StudentLifePage from '@/components/studentLife/StudentLifePage';
export default function StudentLife() {
  const { universityId } = useParams(); const [content, setContent] = useState<StudentLifeContent | null>(null); const [loaded, setLoaded] = useState(false);
  useEffect(() => { function load() { try { const universities: UniversityDetails[] = JSON.parse(localStorage.getItem('acado_universities') || '[]'); const university = universities.find(item => item.id === universityId); setContent(university && universityId ? publishedStudentLife(readLifeRecords()[universityId], universityId, university.isActive) : null); } catch { setContent(null); } setLoaded(true); } load(); window.addEventListener('storage', load); window.addEventListener('focus', load); return () => { window.removeEventListener('storage', load); window.removeEventListener('focus', load); }; }, [universityId]);
  return content ? <StudentLifePage content={content} /> : <div className="py-16 text-center"><h1 className="text-2xl font-semibold">Student Life</h1><p className="mt-3 text-muted-foreground">{loaded ? 'Student Life content is not currently published for this university.' : 'Loading…'}</p></div>;
}
