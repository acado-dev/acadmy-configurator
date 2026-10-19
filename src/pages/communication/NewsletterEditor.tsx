import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getNewsletters, saveNewsletter, Newsletter } from '@/lib/websiteCommunication';
import { toast } from 'sonner';

export default function NewsletterEditor() {
  const { newsletterId } = useParams(); const navigate = useNavigate();
  const [existing] = useState(() => getNewsletters().find(n => n.id === newsletterId));
  const [title, setTitle] = useState(existing?.title || ''); const [subject, setSubject] = useState(existing?.subject || ''); const [body, setBody] = useState(existing?.body || ''); const [preview, setPreview] = useState(false);
  const save = (status: Newsletter['status']) => { try { saveNewsletter({ title, subject, body }, newsletterId, status); toast.success(status === 'Ready' ? 'Newsletter ready for review' : 'Draft saved'); navigate('/communication/newsletters'); } catch (error) { toast.error(error instanceof Error && !('issues' in error) ? error.message : 'Enter a title, subject and newsletter content.'); } };
  if (newsletterId && !existing) return <div className="space-y-4"><h1 className="text-2xl font-bold">Newsletter not found</h1><Button asChild variant="outline"><Link to="/communication/newsletters">Back to newsletters</Link></Button></div>;
  return <div className="space-y-6 max-w-5xl">
    <Button asChild variant="ghost"><Link to="/communication/newsletters"><ArrowLeft className="h-4 w-4 mr-2" />Newsletters</Link></Button>
    <header className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold">{existing ? 'Edit newsletter' : 'Create newsletter'}</h1><Button variant="outline" onClick={() => setPreview(true)}><Eye className="h-4 w-4 mr-2" />Preview</Button></header>
    <div className="space-y-5"><div className="space-y-2"><Label htmlFor="newsletter-title">Newsletter title *</Label><Input id="newsletter-title" maxLength={200} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. ACADO October update" /></div><div className="space-y-2"><Label htmlFor="newsletter-subject">Email subject *</Label><Input id="newsletter-subject" maxLength={200} value={subject} onChange={e => setSubject(e.target.value)} /></div><div className="space-y-2"><Label>Newsletter content *</Label><ReactQuill value={body} onChange={setBody} theme="snow" modules={{ toolbar: [[{ header: [1, 2, false] }], ['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link', 'clean']] }} /></div></div>
    <div className="flex flex-wrap gap-3 border-t pt-4"><Button variant="outline" onClick={() => save('Draft')}><Save className="h-4 w-4 mr-2" />Save draft</Button><Button onClick={() => save('Ready')}>Save as ready</Button></div>
    <Dialog open={preview} onOpenChange={setPreview}><DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{title || 'Newsletter preview'}</DialogTitle><DialogDescription>Subject: {subject || '—'}</DialogDescription></DialogHeader><ReactQuill readOnly value={body} theme="bubble" /></DialogContent></Dialog>
  </div>;
}