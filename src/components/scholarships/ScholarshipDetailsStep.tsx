import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Upload, HelpCircle } from "lucide-react";
import { Scholarship } from "@/types/scholarship";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScholarshipDetailsStepProps {
  scholarshipData: Partial<Scholarship>;
  setScholarshipData: (data: Partial<Scholarship>) => void;
  onNext: () => void;
  onSaveDraft: () => void;
  isEditMode: boolean;
}

const ScholarshipDetailsStep = ({
  scholarshipData,
  setScholarshipData,
  onNext,
  onSaveDraft,
}: ScholarshipDetailsStepProps) => {
  const [newTag, setNewTag] = useState("");
  const [newField, setNewField] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !scholarshipData.categoryTags?.includes(newTag.trim())) {
      setScholarshipData({
        ...scholarshipData,
        categoryTags: [...(scholarshipData.categoryTags || []), newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setScholarshipData({
      ...scholarshipData,
      categoryTags: scholarshipData.categoryTags?.filter((t) => t !== tag),
    });
  };

  const handleAddField = () => {
    if (newField.trim() && !scholarshipData.fieldsOfStudy?.includes(newField.trim())) {
      setScholarshipData({
        ...scholarshipData,
        fieldsOfStudy: [...(scholarshipData.fieldsOfStudy || []), newField.trim()],
      });
      setNewField("");
    }
  };

  const handleRemoveField = (field: string) => {
    setScholarshipData({
      ...scholarshipData,
      fieldsOfStudy: scholarshipData.fieldsOfStudy?.filter((f) => f !== field),
    });
  };

  const handleNext = () => {
    // Basic validation
    if (!scholarshipData.title || !scholarshipData.providerName || !scholarshipData.amount || !scholarshipData.applicationDeadline) {
      alert("Please fill in all required fields (marked with *)");
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Scholarship Details</h2>
        <p className="text-muted-foreground">
          Provide basic information about the scholarship program
        </p>
      </div>

      {/* Basic Details */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Basic Details</h3>

        {/* Banner Upload */}
        <div className="space-y-2">
          <Label>Scholarship Banner / Thumbnail</Label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WEBP up to 5MB
            </p>
            <Input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              className="mt-2"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setScholarshipData({ ...scholarshipData, bannerUrl: url, thumbnailUrl: url });
                }
              }}
            />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Scholarship Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="e.g., Merit Scholarship for Engineering Students"
            value={scholarshipData.title || ""}
            onChange={(e) => setScholarshipData({ ...scholarshipData, title: e.target.value })}
          />
        </div>

        {/* Category Tags */}
        <div className="space-y-2">
          <Label>Category Tags</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag (press Enter)"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
            />
            <Button type="button" onClick={handleAddTag}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {scholarshipData.categoryTags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Provider/Organization */}
        <div className="space-y-2">
          <Label htmlFor="provider">
            Provider / Organization <span className="text-destructive">*</span>
          </Label>
          <Input
            id="provider"
            placeholder="e.g., XYZ Foundation"
            value={scholarshipData.providerName || ""}
            onChange={(e) => setScholarshipData({ ...scholarshipData, providerName: e.target.value, providerId: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="type">
            Scholarship Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={scholarshipData.type}
            onValueChange={(value: any) => setScholarshipData({ ...scholarshipData, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="merit">Merit-based</SelectItem>
              <SelectItem value="need_based">Need-based</SelectItem>
              <SelectItem value="partial">Partial Funding</SelectItem>
              <SelectItem value="full">Full Funding</SelectItem>
              <SelectItem value="fellowship">Fellowship</SelectItem>
              <SelectItem value="travel_grant">Travel Grant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amount & Currency */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center gap-2">
              Amount / Value <span className="text-destructive">*</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the total scholarship amount or stipend value</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="e.g., 5000"
              value={scholarshipData.amount || ""}
              onChange={(e) => setScholarshipData({ ...scholarshipData, amount: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={scholarshipData.currency}
              onValueChange={(value) => setScholarshipData({ ...scholarshipData, currency: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="INR">INR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Number of Awards */}
        <div className="space-y-2">
          <Label htmlFor="awards">Number of Awards</Label>
          <Input
            id="awards"
            type="number"
            min="1"
            placeholder="e.g., 10"
            value={scholarshipData.numberOfAwards || ""}
            onChange={(e) => setScholarshipData({ ...scholarshipData, numberOfAwards: Number(e.target.value) })}
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            placeholder="e.g., 12 months, 1 year, one-time"
            value={scholarshipData.duration || ""}
            onChange={(e) => setScholarshipData({ ...scholarshipData, duration: e.target.value })}
          />
        </div>

        {/* Study Level */}
        <div className="space-y-2">
          <Label htmlFor="studyLevel">Study Level</Label>
          <Select
            value={scholarshipData.studyLevel}
            onValueChange={(value: any) => setScholarshipData({ ...scholarshipData, studyLevel: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="undergraduate">Undergraduate</SelectItem>
              <SelectItem value="postgraduate">Postgraduate</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
              <SelectItem value="short_course">Short Course</SelectItem>
              <SelectItem value="any">Any Level</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fields of Study */}
        <div className="space-y-2">
          <Label>Fields of Study</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add field (press Enter)"
              value={newField}
              onChange={(e) => setNewField(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddField())}
            />
            <Button type="button" onClick={handleAddField}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {scholarshipData.fieldsOfStudy?.map((field) => (
              <Badge key={field} variant="secondary" className="gap-1">
                {field}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveField(field)}
                />
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Description Blocks */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Description</h3>

        <div className="space-y-2">
          <Label htmlFor="shortDesc">
            Short Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="shortDesc"
            placeholder="Brief summary (max 300 characters)"
            maxLength={300}
            rows={3}
            value={scholarshipData.shortDescription || ""}
            onChange={(e) => setScholarshipData({ ...scholarshipData, shortDescription: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            {(scholarshipData.shortDescription || "").length}/300 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Full Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Detailed description of the scholarship, eligibility criteria, benefits, etc."
            rows={6}
            value={scholarshipData.description || ""}
            onChange={(e) => setScholarshipData({ ...scholarshipData, description: e.target.value })}
          />
        </div>
      </div>

      {/* Schedule & Dates */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Schedule & Dates</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deadline">
              Application Deadline <span className="text-destructive">*</span>
            </Label>
            <Input
              id="deadline"
              type="date"
              value={scholarshipData.applicationDeadline || ""}
              onChange={(e) => setScholarshipData({ ...scholarshipData, applicationDeadline: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Award Date / Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={scholarshipData.startDate || ""}
              onChange={(e) => setScholarshipData({ ...scholarshipData, startDate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mode">Application Mode</Label>
          <Select
            value={scholarshipData.mode}
            onValueChange={(value: any) => setScholarshipData({ ...scholarshipData, mode: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onSaveDraft}>
          Save Draft
        </Button>
        <Button onClick={handleNext}>
          Save & Next
        </Button>
      </div>
    </div>
  );
};

export default ScholarshipDetailsStep;
