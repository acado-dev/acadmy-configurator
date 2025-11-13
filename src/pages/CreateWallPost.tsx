import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { WallPost } from "@/types/wallPost";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const STORAGE_KEY = "wallPosts";
const MAX_CHARS = 1000;

export default function CreateWallPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    description: "",
    media: "",
    mediaType: undefined as 'image' | 'video' | undefined,
  });
  const [charCount, setCharCount] = useState(0);

  // Load post data for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const savedPosts = localStorage.getItem(STORAGE_KEY);
      if (savedPosts) {
        const posts: WallPost[] = JSON.parse(savedPosts);
        const post = posts.find((p) => p.id === id);
        if (post) {
          setFormData({
            description: post.description,
            media: post.media || "",
            mediaType: post.mediaType,
          });
          setCharCount(post.description.length);
        }
      }
    }
  }, [isEditMode, id]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setFormData((prev) => ({ ...prev, description: value }));
      setCharCount(value.length);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast({
        title: "Error",
        description: "Only image and video files are allowed",
        variant: "destructive",
      });
      return;
    }

    // Validate file formats
    if (isImage) {
      const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml", "image/webp"];
      if (!validImageTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Only .jpg, .jpeg, .png, .gif, .svg, and .webp files are allowed for images",
          variant: "destructive",
        });
        return;
      }
    }

    if (isVideo) {
      const validVideoTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm"];
      if (!validVideoTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Only .mp4, .mov, .avi, .mkv, and .webm files are allowed for videos",
          variant: "destructive",
        });
        return;
      }
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        media: reader.result as string,
        mediaType: isImage ? 'image' : 'video',
      }));
      toast({
        title: "Success",
        description: "Media uploaded successfully",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      toast({
        title: "Error",
        description: "Description is required",
        variant: "destructive",
      });
      return;
    }

    const savedPosts = localStorage.getItem(STORAGE_KEY);
    const posts: WallPost[] = savedPosts ? JSON.parse(savedPosts) : [];

    if (isEditMode && id) {
      // Update existing post
      const postIndex = posts.findIndex((p) => p.id === id);
      if (postIndex !== -1) {
        posts[postIndex] = {
          ...posts[postIndex],
          description: formData.description,
          media: formData.media || undefined,
          mediaType: formData.mediaType,
          updatedAt: new Date(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
        toast({
          title: "Success",
          description: "Post updated successfully",
        });
      }
    } else {
      // Create new post
      const newPost: WallPost = {
        id: Date.now().toString(),
        description: formData.description,
        media: formData.media || undefined,
        mediaType: formData.mediaType,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      posts.push(newPost);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
      toast({
        title: "Success",
        description: "Post created successfully",
      });
    }

    navigate("/wall");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/wall">Wall</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{isEditMode ? "Edit" : "Create"} Post</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? "Edit" : "Create"} Wall Post
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode ? "Update your wall post" : "Share content with all learners"}
          </p>
        </div>

        {/* Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Post Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Write your post description here... Supports emojis 😊"
                value={formData.description}
                onChange={handleDescriptionChange}
                className="min-h-[200px] resize-none"
                maxLength={MAX_CHARS}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  Supports rich text and emojis
                </p>
                <p className={`text-sm ${charCount > MAX_CHARS * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {charCount} / {MAX_CHARS} characters
                </p>
              </div>
            </div>

            {/* Media Upload */}
            <div className="space-y-2">
              <Label htmlFor="media">Upload Media (Optional)</Label>
              <Input
                id="media"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml,image/webp,video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm"
                onChange={handleFileUpload}
              />
              {formData.media && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  {formData.mediaType === 'image' ? (
                    <img
                      src={formData.media}
                      alt="Media preview"
                      className="max-w-md rounded-lg border"
                    />
                  ) : formData.mediaType === 'video' ? (
                    <video
                      src={formData.media}
                      controls
                      className="max-w-md rounded-lg border"
                    />
                  ) : null}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Images: .jpg, .jpeg, .png, .gif, .svg, .webp | Videos: .mp4, .mov, .avi, .mkv, .webm
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="submit" className="min-w-32">
                {isEditMode ? "Update" : "Create"} Post
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/wall")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
