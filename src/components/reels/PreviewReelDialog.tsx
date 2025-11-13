import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Reel } from "@/types/reel";

interface PreviewReelDialogProps {
  open: boolean;
  reel?: Reel;
  onClose: () => void;
}

export function PreviewReelDialog({ open, reel, onClose }: PreviewReelDialogProps) {
  if (!reel) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview Reel</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Video Player */}
          <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden max-w-md mx-auto">
            <video
              src={reel.videoUrl}
              controls
              className="w-full h-full"
              poster={reel.thumbnailUrl}
            />
          </div>

          {/* Metadata */}
          <div className="space-y-3">
            <div>
              <h3 className="text-2xl font-bold">{reel.title}</h3>
              {reel.description && (
                <p className="text-muted-foreground mt-2">{reel.description}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{reel.category}</Badge>
              <Badge variant="outline">{reel.language}</Badge>
              <Badge
                variant={
                  reel.status === "active"
                    ? "default"
                    : reel.status === "draft"
                    ? "secondary"
                    : "outline"
                }
              >
                {reel.status}
              </Badge>
              <Badge variant="outline">{formatDuration(reel.duration)}</Badge>
            </div>

            {reel.tags && reel.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {reel.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <div className="text-sm text-muted-foreground">Views</div>
                <div className="text-2xl font-bold">{reel.views}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Likes</div>
                <div className="text-2xl font-bold">{reel.likes}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Visibility</div>
                <div className="text-sm font-medium capitalize">{reel.visibility}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="text-sm font-medium">
                  {new Date(reel.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {reel.scheduledPublishAt && (
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground">Scheduled Publish</div>
                <div className="text-sm font-medium">
                  {new Date(reel.scheduledPublishAt).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
