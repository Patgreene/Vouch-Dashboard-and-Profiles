import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Save,
  User,
  Upload,
  Image,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile, KeyTakeaways, Transcript } from "@/lib/data";

interface ProfileFormProps {
  onClose: () => void;
  onSave: (profile: Profile) => void;
  editingProfile?: Profile | null;
}

interface FormData {
  id: string;
  name: string;
  title: string;
  company: string;
  photo: string;
  linkedIn: string;
  cv: string;
  portfolio: string;
  keyTakeaways: KeyTakeaways;
  transcripts: Transcript[];
}

const initialFormData: FormData = {
  id: "",
  name: "",
  title: "",
  company: "",
  photo: "",
  linkedIn: "",
  cv: "",
  portfolio: "",
  keyTakeaways: {
    strengths: [""],
    weaknesses: [""],
    communicationStyle: [""],
    waysToBringOutBest: [""],
    customTitle1: "",
    customTitle2: "",
  },
  transcripts: [
    {
      id: "",
      speakerName: "",
      speakerRole: "",
      speakerPhoto: "",
      content: "",
      interviewDate: "",
      interviewedBy: "",
    },
  ],
};

export function ProfileForm({
  onClose,
  onSave,
  editingProfile,
}: ProfileFormProps) {
  // Progress states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [formData, setFormData] = useState<FormData>(() => {
    if (editingProfile) {
      return {
        ...editingProfile,
        company: editingProfile.company || "",
        photo: editingProfile.photo || "",
        linkedIn: editingProfile.linkedIn || "",
        cv: editingProfile.cv || "",
        portfolio: editingProfile.portfolio || "",
        keyTakeaways: editingProfile.keyTakeaways,
        transcripts: editingProfile.transcripts.length
          ? editingProfile.transcripts
          : initialFormData.transcripts,
      };
    }
    return {
      ...initialFormData,
      id: `profile-${Date.now()}`,
    };
  });

  const updateBasicField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateTakeawaySection = (
    section: keyof KeyTakeaways,
    index: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      keyTakeaways: {
        ...prev.keyTakeaways,
        [section]: (prev.keyTakeaways[section] as string[]).map((item, i) =>
          i === index ? value : item,
        ),
      },
    }));
  };

  const addTakeawayItem = (section: keyof KeyTakeaways) => {
    setFormData((prev) => ({
      ...prev,
      keyTakeaways: {
        ...prev.keyTakeaways,
        [section]: [...(prev.keyTakeaways[section] as string[]), ""],
      },
    }));
  };

  const removeTakeawayItem = (section: keyof KeyTakeaways, index: number) => {
    setFormData((prev) => ({
      ...prev,
      keyTakeaways: {
        ...prev.keyTakeaways,
        [section]: (prev.keyTakeaways[section] as string[]).filter(
          (_, i) => i !== index,
        ),
      },
    }));
  };

  const updateTranscript = <T extends keyof Transcript>(
    index: number,
    field: T,
    value: Transcript[T],
  ) => {
    setFormData((prev) => ({
      ...prev,
      transcripts: prev.transcripts.map((transcript, i) =>
        i === index ? { ...transcript, [field]: value } : transcript,
      ),
    }));
  };

  const handleSpeakerPhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    transcriptIndex: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        updateTranscript(transcriptIndex, "speakerPhoto", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setFormData((prev) => ({ ...prev, photo: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addTranscript = () => {
    setFormData((prev) => ({
      ...prev,
      transcripts: [
        ...prev.transcripts,
        {
          id: `transcript-${Date.now()}`,
          speakerName: "",
          speakerRole: "",
          speakerPhoto: "",
          content: "",
          interviewDate: "",
          interviewedBy: "",
        },
      ],
    }));
  };

  const removeTranscript = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      transcripts: prev.transcripts.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset states
    setSubmitStatus("idle");
    setErrorMessage("");

    // Validate required fields
    if (!formData.name.trim() || !formData.title.trim()) {
      setSubmitStatus("error");
      setErrorMessage("Please fill in all required fields (Name and Title).");
      return;
    }

    // Validate transcripts
    const validTranscripts = formData.transcripts.filter(
      (t) => t.speakerName.trim() && t.speakerRole.trim() && t.content.trim(),
    );

    if (validTranscripts.length === 0) {
      setSubmitStatus("error");
      setErrorMessage("Please add at least one complete transcript.");
      return;
    }

    // Start loading state
    setIsSubmitting(true);

    try {
      // Prepare final transcript data
      const finalTranscripts = validTranscripts.map((transcript) => ({
        ...transcript,
        id: transcript.id || `transcript-${Date.now()}-${Math.random()}`,
      }));

      const profile: Profile = {
        ...formData,
        // Ensure ID is set (use existing ID for edits, or generated ID for new profiles)
        id: editingProfile ? editingProfile.id : formData.id,
        transcripts: finalTranscripts,
        keyTakeaways: {
          strengths: formData.keyTakeaways.strengths.filter((s) => s.trim()),
          weaknesses: formData.keyTakeaways.weaknesses.filter((w) => w.trim()),
          communicationStyle: formData.keyTakeaways.communicationStyle.filter(
            (c) => c.trim(),
          ),
          waysToBringOutBest: formData.keyTakeaways.waysToBringOutBest.filter(
            (w) => w.trim(),
          ),
          customTitle1: formData.keyTakeaways.customTitle1?.trim() || undefined,
          customTitle2: formData.keyTakeaways.customTitle2?.trim() || undefined,
        },
      };

      // Call the onSave function and wait for it
      await onSave(profile);

      // Show success state
      setSubmitStatus("success");
      setIsSubmitting(false);

      // Auto-close after success (optional - you can remove this if you want manual close)
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setIsSubmitting(false);
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
      );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Progress Bar Component
  const ProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
      <div
        className="bg-vouch-600 h-2 rounded-full transition-all duration-1000 ease-out"
        style={{
          width: isSubmitting ? "100%" : "0%",
          animation: isSubmitting ? "progress 2s ease-in-out" : "none",
        }}
      />
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );

  // Status Message Component
  const StatusMessage = () => {
    if (submitStatus === "success") {
      return (
        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
          <CheckCircle className="h-4 w-4" />
          Success!
        </div>
      );
    }

    if (submitStatus === "error") {
      return (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>
            <strong>Oops!</strong> {errorMessage}
          </span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingProfile ? "Edit Profile" : "Create New Profile"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preview */}
              {formData.name && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="h-16 w-16 ring-2 ring-gray-200 profile-avatar-medium">
                    <AvatarImage
                      src={formData.photo}
                      alt={formData.name}
                      className="object-cover object-center"
                    />
                    <AvatarFallback className="text-lg font-semibold bg-vouch-100 text-vouch-600">
                      {getInitials(formData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{formData.name}</h3>
                    <p className="text-gray-600">{formData.title}</p>
                    {formData.company && (
                      <Badge variant="outline" className="mt-1">
                        {formData.company}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Photo Upload */}
              <div>
                <Label htmlFor="photo">Profile Photo</Label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 ring-2 ring-gray-200 profile-avatar-medium">
                      <AvatarImage
                        src={formData.photo}
                        alt={formData.name}
                        className="object-cover object-center"
                      />
                      <AvatarFallback className="text-lg font-semibold bg-vouch-100 text-vouch-600">
                        {getInitials(formData.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        ref={(ref) => {
                          if (ref) {
                            (window as any).photoInputRef = ref;
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById(
                            "photo",
                          ) as HTMLInputElement;
                          input?.click();
                        }}
                        className="mb-2"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                      <p className="text-xs text-gray-500">
                        Upload any image - it will be automatically fitted to
                        maintain proper proportions
                      </p>
                    </div>
                  </div>
                  {formData.photo && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateBasicField("photo", "")}
                    >
                      Remove Photo
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateBasicField("name", e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateBasicField("title", e.target.value)}
                    placeholder="Senior Software Engineer"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      updateBasicField("company", e.target.value)
                    }
                    placeholder="Acme Corp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedIn}
                    onChange={(e) =>
                      updateBasicField("linkedIn", e.target.value)
                    }
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="cv">CV URL</Label>
                  <Input
                    id="cv"
                    value={formData.cv}
                    onChange={(e) => updateBasicField("cv", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="portfolio">Portfolio URL</Label>
                  <Input
                    id="portfolio"
                    value={formData.portfolio}
                    onChange={(e) =>
                      updateBasicField("portfolio", e.target.value)
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Takeaways */}
          <Card>
            <CardHeader>
              <CardTitle>Key Takeaways</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Custom Section Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="customTitle1" className="text-sm font-medium">
                    Section 3 Title (default: "Custom Section 1")
                  </Label>
                  <Input
                    id="customTitle1"
                    value={formData.keyTakeaways.customTitle1 || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        keyTakeaways: {
                          ...prev.keyTakeaways,
                          customTitle1: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g., Communication Style, Leadership, Technical Skills"
                  />
                </div>
                <div>
                  <Label htmlFor="customTitle2" className="text-sm font-medium">
                    Section 4 Title (default: "Custom Section 2")
                  </Label>
                  <Input
                    id="customTitle2"
                    value={formData.keyTakeaways.customTitle2 || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        keyTakeaways: {
                          ...prev.keyTakeaways,
                          customTitle2: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g., Ways to Bring Out Their Best, Work Style"
                  />
                </div>
              </div>

              {/* Fixed Sections */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold">Strengths</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addTakeawayItem("strengths")}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.keyTakeaways.strengths.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Textarea
                        value={item}
                        onChange={(e) =>
                          updateTakeawaySection(
                            "strengths",
                            index,
                            e.target.value,
                          )
                        }
                        placeholder="Enter strength..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTakeawayItem("strengths", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold">Challenges</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addTakeawayItem("weaknesses")}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.keyTakeaways.weaknesses.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Textarea
                        value={item}
                        onChange={(e) =>
                          updateTakeawaySection(
                            "weaknesses",
                            index,
                            e.target.value,
                          )
                        }
                        placeholder="Enter challenge..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTakeawayItem("weaknesses", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold">
                    {formData.keyTakeaways.customTitle1 || "Custom Section 1"}
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addTakeawayItem("communicationStyle")}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.keyTakeaways.communicationStyle.map(
                    (item, index) => (
                      <div key={index} className="flex gap-2">
                        <Textarea
                          value={item}
                          onChange={(e) =>
                            updateTakeawaySection(
                              "communicationStyle",
                              index,
                              e.target.value,
                            )
                          }
                          placeholder={`Enter ${formData.keyTakeaways.customTitle1 || "custom section 1"} item...`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            removeTakeawayItem("communicationStyle", index)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold">
                    {formData.keyTakeaways.customTitle2 || "Custom Section 2"}
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addTakeawayItem("waysToBringOutBest")}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.keyTakeaways.waysToBringOutBest.map(
                    (item, index) => (
                      <div key={index} className="flex gap-2">
                        <Textarea
                          value={item}
                          onChange={(e) =>
                            updateTakeawaySection(
                              "waysToBringOutBest",
                              index,
                              e.target.value,
                            )
                          }
                          placeholder={`Enter ${formData.keyTakeaways.customTitle2 || "custom section 2"} item...`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            removeTakeawayItem("waysToBringOutBest", index)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transcripts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reference Transcripts</CardTitle>
                <Button type="button" variant="outline" onClick={addTranscript}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transcript
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.transcripts.map((transcript, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      Transcript {index + 1}
                      {transcript.speakerName && ` - ${transcript.speakerName}`}
                    </h4>
                    {formData.transcripts.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTranscript(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Speaker Name *</Label>
                      <Input
                        value={transcript.speakerName}
                        onChange={(e) =>
                          updateTranscript(index, "speakerName", e.target.value)
                        }
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <Label>Speaker Role *</Label>
                      <Input
                        value={transcript.speakerRole}
                        onChange={(e) =>
                          updateTranscript(index, "speakerRole", e.target.value)
                        }
                        placeholder="Senior Manager at Company"
                      />
                    </div>
                  </div>

                  {/* Speaker Photo Upload */}
                  <div>
                    <Label>Speaker Photo</Label>
                    <div className="flex items-center gap-4">
                      {transcript.speakerPhoto ? (
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={transcript.speakerPhoto}
                            alt={transcript.speakerName}
                            className="object-cover object-center"
                          />
                          <AvatarFallback className="text-xs font-semibold bg-vouch-100 text-vouch-600">
                            {getInitials(transcript.speakerName)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSpeakerPhotoUpload(e, index)}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-vouch-50 file:text-vouch-700 hover:file:bg-vouch-100"
                        />
                      </div>
                      {transcript.speakerPhoto && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateTranscript(index, "speakerPhoto", "")
                          }
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Interview Date</Label>
                      <Input
                        type="date"
                        value={transcript.interviewDate}
                        onChange={(e) =>
                          updateTranscript(
                            index,
                            "interviewDate",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label>Interviewed By</Label>
                      <Input
                        value={transcript.interviewedBy}
                        onChange={(e) =>
                          updateTranscript(
                            index,
                            "interviewedBy",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Sarah Johnson, HR Partner"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Transcript Content *</Label>
                    <Textarea
                      value={transcript.content}
                      onChange={(e) =>
                        updateTranscript(index, "content", e.target.value)
                      }
                      placeholder="Enter the full transcript content here. Use double line breaks to separate paragraphs..."
                      className="min-h-[200px]"
                    />
                  </div>

                  {/* Preview */}
                  {transcript.speakerName && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={transcript.speakerPhoto}
                            alt={transcript.speakerName}
                            className="object-cover object-center"
                          />
                          <AvatarFallback className="text-xs font-semibold bg-vouch-100 text-vouch-600">
                            {getInitials(transcript.speakerName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-sm">
                            {transcript.speakerName}
                          </div>
                          <div className="text-xs text-gray-600">
                            {transcript.speakerRole}
                          </div>
                        </div>
                      </div>
                      {transcript.content && (
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {transcript.content.substring(0, 200)}
                          {transcript.content.length > 200 && "..."}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="pt-6 border-t border-gray-200">
            {/* Progress Bar and Status */}
            {(isSubmitting || submitStatus !== "idle") && (
              <div className="mb-4">
                {isSubmitting && <ProgressBar />}
                <StatusMessage />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="gradient-bg min-w-[140px]"
                disabled={isSubmitting || submitStatus === "success"}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {editingProfile ? "Updating..." : "Creating..."}
                  </>
                ) : submitStatus === "success" ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Success!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingProfile ? "Update Profile" : "Create Profile"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
