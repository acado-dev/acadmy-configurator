import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "@/hooks/use-toast";
import { CommunityPost, CommunityCategory, ContentType } from "@/types/communityPost";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ArrowLeft } from "lucide-react";

const STORAGE_KEYS = {
  POSTS: "communityPosts",
  CATEGORIES: "communityCategories",
};

const contentTypes: ContentType[] = ["images", "notes", "videos"];

export default function CreateCommunityPost() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const isEditMode = !!postId;

  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [formData, setFormData] = useState<Partial<CommunityPost>>({
    title: "",
    description: "",
    contentType: "notes",
    categoryId: "",
    thumbnail: "",
    media: "",
    isPinned: false,
  });

  // Load data
  useEffect(() => {
    const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (savedCategories) {
      const parsedCategories = JSON.parse(savedCategories);
      setCategories(parsedCategories);
      
      // Set default category if none selected
      if (!formData.categoryId && parsedCategories.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: parsedCategories[0].id }));
      }
    }

    if (isEditMode) {
      const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
      if (savedPosts) {
        const posts: CommunityPost[] = JSON.parse(savedPosts);
        const post = posts.find((p) => p.id === postId);
        if (post) {
          setFormData(post);
        } else {
          toast({
            title: "Error",
            description: "Post not found",
            variant: "destructive",
          });
          navigate("/communities");
        }
      }
    }
  }, [postId, isEditMode, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title?.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.categoryId) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    if (!formData.thumbnail?.trim()) {
      toast({
        title: "Error",
        description: "Thumbnail is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.media?.trim()) {
      toast({
        title: "Error",
        description: "Media file is required",
        variant: "destructive",
      });
      return;
    }

    // Save post
    const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
    const posts: CommunityPost[] = savedPosts ? JSON.parse(savedPosts) : [];

    const postData: CommunityPost = {
      id: isEditMode ? postId! : Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description || "",
      contentType: formData.contentType || "notes",
      categoryId: formData.categoryId,
      thumbnail: formData.thumbnail,
      media: formData.media,
      isPinned: formData.isPinned || false,
      createdAt: isEditMode
        ? posts.find((p) => p.id === postId)?.createdAt || new Date()
        : new Date(),
      updatedAt: new Date(),
    };

    let updatedPosts: CommunityPost[];
    if (isEditMode) {
      updatedPosts = posts.map((p) => (p.id === postId ? postData : p));
    } else {
      updatedPosts = [...posts, postData];
    }

    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updatedPosts));

    toast({
      title: "Success",
      description: `Post ${isEditMode ? "updated" : "created"} successfully`,
    });

    navigate("/communities");
  };

  const handleFileUpload = (field: "thumbnail" | "media") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (field === "thumbnail") {
        const validTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!validTypes.includes(file.type)) {
          toast({
            title: "Error",
            description: "Only .jpg, .jpeg, and .png files are allowed for thumbnail",
            variant: "destructive",
          });
          return;
        }
      }

      if (field === "media") {
        const contentType = formData.contentType;
        let validTypes: string[] = [];
        let errorMessage = "";

        if (contentType === "images") {
          validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml", "image/webp"];
          errorMessage = "Only .jpg, .jpeg, .png, .gif, .svg, and .webp files are allowed for images";
        } else if (contentType === "notes") {
          validTypes = ["application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
          errorMessage = "Only .pdf, .ppt, .pptx, .doc, and .docx files are allowed for notes";
        } else if (contentType === "videos") {
          validTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm"];
          errorMessage = "Only .mp4, .mov, .avi, .mkv, and .webm files are allowed for videos";
        }

        if (validTypes.length > 0 && !validTypes.includes(file.type)) {
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
          return;
        }
      }

      // In a real application, you would upload the file to a server
      // For now, we'll store the file name
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Welcome</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/communities">Community Post</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{isEditMode ? "Edit" : "Create"} Post</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/communities")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isEditMode ? "Edit" : "Create"} Community Post</h1>
          <p className="text-muted-foreground">
            {isEditMode ? "Update the post details below" : "Fill in the details to create a new post"}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter post title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <ReactQuill
              theme="snow"
              value={formData.description || ""}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Write your post description..."
              className="bg-background"
            />
          </div>

          {/* Content Type */}
          <div className="space-y-2">
            <Label htmlFor="contentType">Content Type</Label>
            <Select
              value={formData.contentType || "notes"}
              onValueChange={(value: ContentType) =>
                setFormData({ ...formData, contentType: value })
              }
            >
              <SelectTrigger id="contentType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.categoryId || ""}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upload Thumbnail */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">
              Upload Thumbnail <span className="text-destructive">*</span>
            </Label>
            <Input
              id="thumbnail"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileUpload("thumbnail")}
            />
            {formData.thumbnail && (
              <div className="mt-2">
                <img
                  src={formData.thumbnail}
                  alt="Thumbnail preview"
                  className="max-w-xs rounded-md border"
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">Supported formats: .jpg, .png, .jpeg</p>
          </div>

          {/* Upload Media */}
          <div className="space-y-2">
            <Label htmlFor="media">
              Upload Media <span className="text-destructive">*</span>
            </Label>
            <Input 
              id="media" 
              type="file" 
              accept={
                formData.contentType === "images" 
                  ? ".jpg,.jpeg,.png,.gif,.svg,.webp"
                  : formData.contentType === "notes"
                  ? ".pdf,.ppt,.pptx,.doc,.docx"
                  : formData.contentType === "videos"
                  ? ".mp4,.mov,.avi,.mkv,.webm"
                  : undefined
              }
              onChange={handleFileUpload("media")} 
            />
            {formData.media && (
              <p className="text-sm text-muted-foreground">File uploaded successfully</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.contentType === "images" && "Supported formats: .jpg, .jpeg, .png, .gif, .svg, .webp"}
              {formData.contentType === "notes" && "Supported formats: .pdf, .ppt, .pptx, .doc, .docx"}
              {formData.contentType === "videos" && "Supported formats: .mp4, .mov, .avi, .mkv, .webm"}
            </p>
          </div>

          {/* Pin Post */}
          <div className="space-y-2">
            <Label>Pin Post</Label>
            <RadioGroup
              value={formData.isPinned ? "yes" : "no"}
              onValueChange={(value) => setFormData({ ...formData, isPinned: value === "yes" })}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="pin-yes" />
                  <Label htmlFor="pin-yes" className="font-normal cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="pin-no" />
                  <Label htmlFor="pin-no" className="font-normal cursor-pointer">
                    No
                  </Label>
                </div>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              Pinned posts will appear at the top of the community list
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit">
              {isEditMode ? "Update" : "Post"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/communities")}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
