import { useState } from "react";
import { Upload, Plus, X, HelpCircle } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Event } from "@/types/event";

interface EventDetailsStepProps {
  eventData: Partial<Event>;
  setEventData: (data: Partial<Event>) => void;
  onNext: () => void;
  onSaveDraft: () => void;
  isEditMode?: boolean;
}

const EventDetailsStep = ({ eventData, setEventData, onNext, onSaveDraft }: EventDetailsStepProps) => {
  const [newTag, setNewTag] = useState("");
  const [newSkill, setNewSkill] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !eventData.categoryTags?.includes(newTag.trim())) {
      setEventData({
        ...eventData,
        categoryTags: [...(eventData.categoryTags || []), newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEventData({
      ...eventData,
      categoryTags: eventData.categoryTags?.filter((t) => t !== tag),
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !eventData.skills?.includes(newSkill.trim())) {
      setEventData({
        ...eventData,
        skills: [...(eventData.skills || []), newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setEventData({
      ...eventData,
      skills: eventData.skills?.filter((s) => s !== skill),
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventData({ ...eventData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const isValid = () => {
    return (
      eventData.title &&
      eventData.conductedBy &&
      eventData.functionalDomain &&
      eventData.description &&
      eventData.registrationStartDate &&
      eventData.registrationEndDate &&
      eventData.eventDate &&
      eventData.eventTime
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Event Details</h2>
        <p className="text-muted-foreground">
          Provide basic information about your event
        </p>
      </div>

      {/* Basic Details */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Basic Details</h3>

        {/* Event Logo */}
        <div className="space-y-2">
          <Label>Event Logo</Label>
          <div className="flex items-center gap-4">
            {eventData.logo ? (
              <div className="relative">
                <img
                  src={eventData.logo}
                  alt="Event logo"
                  className="w-24 h-24 rounded-lg object-cover border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={() => setEventData({ ...eventData, logo: undefined })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <label className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </label>
            )}
          </div>
        </div>

        {/* Event Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="title">Event Title *</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Give your event a clear and engaging title</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="title"
            placeholder="e.g., AI & Machine Learning Bootcamp 2024"
            value={eventData.title || ""}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
          />
        </div>

        {/* Category Tags */}
        <div className="space-y-2">
          <Label>Category Tags</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add tag (e.g., Technology, AI)"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
            />
            <Button type="button" onClick={handleAddTag} variant="secondary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {eventData.categoryTags?.map((tag) => (
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

        <div className="grid grid-cols-2 gap-4">
          {/* Conducted By */}
          <div className="space-y-2">
            <Label htmlFor="conductedBy">Conducted By / Organization *</Label>
            <Input
              id="conductedBy"
              placeholder="ACADO"
              value={eventData.conductedBy || ""}
              onChange={(e) =>
                setEventData({ ...eventData, conductedBy: e.target.value })
              }
            />
          </div>

          {/* Functional Domain */}
          <div className="space-y-2">
            <Label htmlFor="functionalDomain">Functional Domain *</Label>
            <Input
              id="functionalDomain"
              placeholder="e.g., Technology, Business"
              value={eventData.functionalDomain || ""}
              onChange={(e) =>
                setEventData({ ...eventData, functionalDomain: e.target.value })
              }
            />
          </div>
        </div>

        {/* Job Role */}
        <div className="space-y-2">
          <Label htmlFor="jobRole">Job Role</Label>
          <Input
            id="jobRole"
            placeholder="e.g., Software Engineer, Data Scientist"
            value={eventData.jobRole || ""}
            onChange={(e) => setEventData({ ...eventData, jobRole: e.target.value })}
          />
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <Label>Skills</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add skill (e.g., Python, React)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
            />
            <Button type="button" onClick={handleAddSkill} variant="secondary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {eventData.skills?.map((skill) => (
              <Badge key={skill} variant="outline" className="gap-1">
                {skill}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveSkill(skill)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Difficulty Level */}
          <div className="space-y-2">
            <Label htmlFor="difficultyLevel">Difficulty Level</Label>
            <Select
              value={eventData.difficultyLevel}
              onValueChange={(value: any) =>
                setEventData({ ...eventData, difficultyLevel: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subscription Type */}
          <div className="space-y-2">
            <Label htmlFor="subscriptionType">Subscription Type</Label>
            <Select
              value={eventData.subscriptionType}
              onValueChange={(value: any) =>
                setEventData({ ...eventData, subscriptionType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Popular Tag */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPopular"
            checked={eventData.isPopular}
            onCheckedChange={(checked) =>
              setEventData({ ...eventData, isPopular: checked as boolean })
            }
          />
          <Label htmlFor="isPopular" className="cursor-pointer">
            Mark as Popular Event
          </Label>
        </div>
      </div>

      {/* Description Blocks */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Description</h3>

        <div className="space-y-2">
          <Label htmlFor="description">Event Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe your event in detail..."
            rows={6}
            value={eventData.description || ""}
            onChange={(e) =>
              setEventData({ ...eventData, description: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsInItForYou">What's in it for you</Label>
          <Textarea
            id="whatsInItForYou"
            placeholder="Benefits and takeaways..."
            rows={4}
            value={eventData.whatsInItForYou || ""}
            onChange={(e) =>
              setEventData({ ...eventData, whatsInItForYou: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">Instructions</Label>
          <Textarea
            id="instructions"
            placeholder="Important instructions for participants..."
            rows={4}
            value={eventData.instructions || ""}
            onChange={(e) =>
              setEventData({ ...eventData, instructions: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="faq">FAQ</Label>
          <Textarea
            id="faq"
            placeholder="Frequently asked questions..."
            rows={4}
            value={eventData.faq || ""}
            onChange={(e) => setEventData({ ...eventData, faq: e.target.value })}
          />
        </div>
      </div>

      {/* Schedule & Mode */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Schedule & Mode</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="registrationStartDate">Registration Start Date *</Label>
            <Input
              id="registrationStartDate"
              type="date"
              value={eventData.registrationStartDate || ""}
              onChange={(e) =>
                setEventData({ ...eventData, registrationStartDate: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationEndDate">Registration End Date *</Label>
            <Input
              id="registrationEndDate"
              type="date"
              value={eventData.registrationEndDate || ""}
              onChange={(e) =>
                setEventData({ ...eventData, registrationEndDate: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventDate">Event Date *</Label>
            <Input
              id="eventDate"
              type="date"
              value={eventData.eventDate || ""}
              onChange={(e) =>
                setEventData({ ...eventData, eventDate: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventTime">Event Time *</Label>
            <Input
              id="eventTime"
              type="time"
              value={eventData.eventTime || ""}
              onChange={(e) =>
                setEventData({ ...eventData, eventTime: e.target.value })
              }
            />
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="space-y-2">
          <Label>Event Mode</Label>
          <div className="flex gap-2">
            {["online", "offline", "hybrid"].map((mode) => (
              <Button
                key={mode}
                type="button"
                variant={eventData.mode === mode ? "default" : "outline"}
                onClick={() => setEventData({ ...eventData, mode: mode as any })}
                className="flex-1 capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>

        {/* Venue (conditional) */}
        {(eventData.mode === "offline" || eventData.mode === "hybrid") && (
          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              placeholder="Enter venue address"
              value={eventData.venue || ""}
              onChange={(e) => setEventData({ ...eventData, venue: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Other Inputs */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>

        <div className="space-y-2">
          <Label htmlFor="expertName">Event Expert</Label>
          <Input
            id="expertName"
            placeholder="Expert name"
            value={eventData.expertName || ""}
            onChange={(e) =>
              setEventData({ ...eventData, expertName: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalInfo">Additional Info</Label>
          <Textarea
            id="additionalInfo"
            placeholder="Any other relevant information..."
            rows={4}
            value={eventData.additionalInfo || ""}
            onChange={(e) =>
              setEventData({ ...eventData, additionalInfo: e.target.value })
            }
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onSaveDraft}>
          Save Draft
        </Button>
        <Button onClick={onNext} disabled={!isValid()}>
          Save & Next
        </Button>
      </div>
    </div>
  );
};

export default EventDetailsStep;
