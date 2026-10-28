import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadPublishedCity } from '@/lib/cityLife';
import type { CityContent } from '@/lib/cityLifeRules';
import CityLifePage from '@/components/cityLife/CityLifePage';
export default function CityLife() {
  const { universityId } = useParams(); const [data,setData] = useState<{name:string;content:CityContent}|null>(null); const [loaded,setLoaded] = useState(false); const [error,setError] = useState('');
  useEffect(() => { let alive=true; async function load() { if (!universityId) return; try { const result=await loadPublishedCity(universityId); if(alive) { setData(result); setError(''); } } catch { if(alive) setError('City Life is temporarily unavailable. Please try again.'); } finally { if(alive) setLoaded(true); } } void load(); window.addEventListener('focus',load); return()=>{alive=false;window.removeEventListener('focus',load);}; },[universityId]);
  return data ? <CityLifePage content={data.content} universityName={data.name} /> : <div className="px-6 py-20 text-center"><h1 className="text-3xl font-semibold">City Life</h1><p className="mt-4 text-muted-foreground">{error || (loaded?'City Life is not currently published for this university.':'Loading City Life…')}</p></div>;
}