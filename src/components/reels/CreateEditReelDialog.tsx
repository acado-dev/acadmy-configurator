import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Reel } from "@/types/reel";
import { Upload, X } from "lucide-react";

interface CreateEditReelDialogProps {
  open: boolean;
  reel?: Reel;
  onClose: () => void;
  onSave: (reel: Reel) => void;
}

export function CreateEditReelDialog({
  open,
  reel,
  onClose,
  onSave,
}: CreateEditReelDialogProps) {
  const [formData, setFormData] = useState<Partial<Reel>>({
    title: "",
    description: "",
    category: "",
    tags: [],
    language: "English",
    visibility: "public",
    status: "draft",
    views: 0,
    likes: 0,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [captionFile, setCaptionFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [tagInput, setTagInput] = useState("");
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reel) {
      setFormData(reel);
      setVideoPreview(reel.videoUrl);
      setThumbnailPreview(reel.thumbnailUrl || "");
    } else {
      setFormData({
        title: "",
        description: "",
        category: "",
        tags: [],
        language: "English",
        visibility: "public",
        status: "draft",
        views: 0,
        likes: 0,
      });
      setVideoFile(null);
      setVideoPreview("");
      setThumbnailFile(null);
      setThumbnailPreview("");
      setCaptionFile(null);
      setVideoDuration(0);
    }
  }, [reel, open]);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["video/mp4", "video/quicktime", "video/x-matroska", "video/webm"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file (.mp4, .mov, .mkv, .webm)",
        variant: "destructive",
      });
      return;
    }

    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);

    // Auto-generate thumbnail and get duration
    const video = document.createElement("video");
    video.src = url;
    video.addEventListener("loadedmetadata", () => {
      const duration = Math.floor(video.duration);
      
      // Validate duration (max 60 seconds)
      if (duration > 60) {
        toast({
          title: "Video too long",
          description: "Maximum video duration is 60 seconds",
          variant: "destructive",
        });
        setVideoFile(null);
        setVideoPreview("");
        return;
      }
      
      setVideoDuration(duration);

      // Generate thumbnail from first frame
      video.currentTime = 1;
      video.addEventListener("seeked", () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob && !thumbnailFile) {
              setThumbnailPreview(URL.createObjectURL(blob));
            }
          }, "image/jpeg");
        }
      });
    });
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (.jpg, .jpeg, .png, .webp)",
        variant: "destructive",
      });
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleCaptionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".srt")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a caption file (.srt)",
        variant: "destructive",
      });
      return;
    }

    setCaptionFile(file);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.title?.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (!videoPreview && !reel) {
      toast({
        title: "Validation Error",
        description: "Video is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.description && formData.description.length > 300) {
      toast({
        title: "Validation Error",
        description: "Description must be less than 300 characters",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const savedReel: Reel = {
      id: reel?.id || `reel-${Date.now()}`,
      title: formData.title!,
      description: formData.description,
      category: formData.category || "General",
      tags: formData.tags || [],
      videoUrl: videoPreview || reel?.videoUrl || "",
      thumbnailUrl: thumbnailPreview || reel?.thumbnailUrl,
      duration: videoDuration || reel?.duration || 0,
      captionUrl: captionFile ? URL.createObjectURL(captionFile) : reel?.captionUrl,
      language: formData.language || "English",
      visibility: formData.visibility || "public",
      status: formData.status || "draft",
      scheduledPublishAt: formData.scheduledPublishAt,
      views: reel?.views || 0,
      likes: reel?.likes || 0,
      createdAt: reel?.createdAt || now,
      updatedAt: now,
      publishedAt: formData.status === "active" ? (reel?.publishedAt || now) : reel?.publishedAt,
    };

    onSave(savedReel);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{reel ? "Edit Reel" : "Create Reel"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter reel title"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Short Description (max 300 chars)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the reel"
              maxLength={300}
              rows={3}
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.description?.length || 0}/300
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Technology, Business, Design"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                placeholder="Add tags (comma-separated)"
              />
              <Button type="button" variant="secondary" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <Label htmlFor="video">
              Upload Video <span className="text-destructive">*</span>
            </Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {videoPreview ? (
                <div className="space-y-2">
                  <video
                    ref={videoRef}
                    src={videoPreview}
                    controls
                    className="w-full rounded-lg max-h-64"
                  />
                  <div className="text-sm text-muted-foreground">
                    Duration: {Math.floor(videoDuration / 60)}:
                    {(videoDuration % 60).toString().padStart(2, "0")}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setVideoFile(null);
                      setVideoPreview("");
                      setVideoDuration(0);
                    }}
                  >
                    Remove Video
                  </Button>
                </div>
              ) : (
                <label htmlFor="video" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload video (max 60 seconds)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported: .mp4, .mov, .mkv, .webm
                  </p>
                  <input
                    id="video"
                    type="file"
                    accept=".mp4,.mov,.mkv,.webm"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Custom Thumbnail (optional)</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {thumbnailPreview ? (
                <div className="space-y-2">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail"
                    className="w-full rounded-lg max-h-48 object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setThumbnailFile(null);
                      setThumbnailPreview("");
                    }}
                  >
                    Remove Thumbnail
                  </Button>
                </div>
              ) : (
                <label htmlFor="thumbnail" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload custom thumbnail
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported: .jpg, .jpeg, .png, .webp
                  </p>
                  <input
                    id="thumbnail"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Caption Upload */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption/Subtitles (optional)</Label>
            <div className="border rounded-lg p-4">
              {captionFile ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm">{captionFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCaptionFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="caption" className="cursor-pointer flex items-center gap-2">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Upload caption file (.srt)
                  </span>
                  <input
                    id="caption"
                    type="file"
                    accept=".srt"
                    onChange={handleCaptionUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={formData.language}
              onValueChange={(value) => setFormData({ ...formData, language: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select
              value={formData.visibility}
              onValueChange={(value: any) => setFormData({ ...formData, visibility: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="organization">Organization Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Schedule Publish */}
          <div className="space-y-2">
            <Label htmlFor="scheduledPublish">Schedule Publish (optional)</Label>
            <Input
              id="scheduledPublish"
              type="datetime-local"
              value={
                formData.scheduledPublishAt
                  ? new Date(formData.scheduledPublishAt).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  scheduledPublishAt: e.target.value ? new Date(e.target.value) : undefined,
                })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {reel ? "Update" : "Create"} Reel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
