import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Opportunity, opportunityPublicUrl } from '@/lib/jobsStorage';

export default function OpportunityQRDialog({ opportunity, onClose }: { opportunity: Opportunity | null; onClose: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  if (!opportunity) return null;
  const url = opportunityPublicUrl(opportunity.id);

  const download = () => {
    const canvas = wrap.current?.querySelector('canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${opportunity.title.replace(/\s+/g, '_')}_QR.png`;
    a.click();
  };
  const copy = async () => { await navigator.clipboard.writeText(url); toast.success('Link copied'); };
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: opportunity.title, text: `${opportunity.type} at ${opportunity.companyName}`, url }); } catch { /* cancelled */ }
    } else copy();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>{opportunity.title} · {opportunity.companyName}</DialogDescription>
        </DialogHeader>
        <div ref={wrap} className="flex justify-center p-4 bg-card border rounded-lg">
          <QRCodeCanvas value={url} size={220} includeMargin />
        </div>
        <div className="flex gap-2">
          <Input readOnly value={url} className="text-xs" />
          <Button variant="outline" size="icon" onClick={copy}><Copy className="h-4 w-4" /></Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={download}><Download className="h-4 w-4 mr-2" />Download</Button>
          <Button variant="outline" onClick={share}><Share2 className="h-4 w-4 mr-2" />Share</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
