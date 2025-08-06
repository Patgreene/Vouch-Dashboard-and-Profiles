import { useState, useEffect } from "react";
import { X, Save, User, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Profile, Transcript } from "@/lib/data";
import { dataProvider } from "@/lib/dataProvider";

interface TranscriptFormProps {
  onClose: () => void;
  onSave: () => void;
  profiles: Profile[];
}

interface FormData {
  voucherEmail: string;
  voucheeEmail: string;
  content: string;
  interviewDate: string;
  interviewedBy: string;
}

export function TranscriptForm({ onClose, onSave, profiles }: TranscriptFormProps) {
  const [formData, setFormData] = useState<FormData>({
    voucherEmail: "",
    voucheeEmail: "",
    content: "",
    interviewDate: "",
    interviewedBy: "",
  });

  const [voucherProfile, setVoucherProfile] = useState<Profile | null>(null);
  const [voucheeProfile, setVoucheeProfile] = useState<Profile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Find profiles by email when emails change
  useEffect(() => {
    if (formData.voucherEmail.trim()) {
      const profile = profiles.find(p => p.email.toLowerCase() === formData.voucherEmail.toLowerCase().trim());
      setVoucherProfile(profile || null);
    } else {
      setVoucherProfile(null);
    }
  }, [formData.voucherEmail, profiles]);

  useEffect(() => {
    if (formData.voucheeEmail.trim()) {
      const profile = profiles.find(p => p.email.toLowerCase() === formData.voucheeEmail.toLowerCase().trim());
      setVoucheeProfile(profile || null);
    } else {
      setVoucheeProfile(null);
    }
  }, [formData.voucheeEmail, profiles]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitStatus("idle");
    setErrorMessage("");

    // Validation
    if (!formData.voucherEmail.trim() || !formData.voucheeEmail.trim() || !formData.content.trim()) {
      setSubmitStatus("error");
      setErrorMessage("Please fill in all required fields (Voucher Email, Vouchee Email, and Content).");
      return;
    }

    if (!voucherProfile) {
      setSubmitStatus("error");
      setErrorMessage("Voucher email must match an existing profile.");
      return;
    }

    if (!voucheeProfile) {
      setSubmitStatus("error");
      setErrorMessage("Vouchee email must match an existing profile.");
      return;
    }

    if (formData.voucherEmail.toLowerCase() === formData.voucheeEmail.toLowerCase()) {
      setSubmitStatus("error");
      setErrorMessage("Voucher and Vouchee must be different people.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new transcript
      const newTranscript: Transcript = {
        id: `transcript-${Date.now()}-${Math.random()}`,
        speakerName: voucherProfile.name,
        speakerRole: voucherProfile.title + (voucherProfile.company ? ` at ${voucherProfile.company}` : ""),
        speakerEmail: voucherProfile.email,
        speakerPhoto: voucherProfile.photo || "",
        content: formData.content.trim(),
        interviewDate: formData.interviewDate || "",
        interviewedBy: formData.interviewedBy.trim() || "",
      };

      // Add transcript to vouchee's profile
      const updatedVoucheeProfile: Profile = {
        ...voucheeProfile,
        transcripts: [...voucheeProfile.transcripts, newTranscript],
      };

      // Save updated profile
      const success = await dataProvider.saveProfile(updatedVoucheeProfile);
      
      if (success) {
        setSubmitStatus("success");
        setTimeout(() => {
          onSave(); // Refresh profiles list
          onClose(); // Close form
        }, 1500);
      } else {
        setSubmitStatus("error");
        setErrorMessage("Failed to save transcript. Please try again.");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress Bar Component
  const ProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
      <div
        className="bg-vouch-600 h-2 rounded-full transition-all duration-1000 ease-out"
        style={{ width: isSubmitting ? "100%" : "0%" }}
      />
    </div>
  );

  // Status Message Component
  const StatusMessage = () => (
    <div className="flex items-center gap-2 text-sm">
      {submitStatus === "success" && (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-green-700">Transcript saved successfully!</span>
        </>
      )}
      {submitStatus === "error" && (
        <>
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-red-700">{errorMessage}</span>
        </>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Add New Transcript
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Voucher (Speaker) Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Voucher (Person Giving Testimonial)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="voucherEmail">Voucher Email *</Label>
                  <Input
                    id="voucherEmail"
                    type="email"
                    value={formData.voucherEmail}
                    onChange={(e) => updateField("voucherEmail", e.target.value)}
                    placeholder="voucher@company.com"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must match an existing profile email
                  </p>
                </div>

                {/* Voucher Profile Preview */}
                {voucherProfile && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={voucherProfile.photo}
                        alt={voucherProfile.name}
                        className="object-cover object-center"
                      />
                      <AvatarFallback className="text-xs font-semibold bg-vouch-100 text-vouch-600">
                        {getInitials(voucherProfile.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm">{voucherProfile.name}</div>
                      <div className="text-xs text-gray-600">{voucherProfile.title}</div>
                      {voucherProfile.company && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {voucherProfile.company}
                        </Badge>
                      )}
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                  </div>
                )}

                {formData.voucherEmail.trim() && !voucherProfile && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    No profile found with this email
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vouchee (Recipient) Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Vouchee (Person Receiving Testimonial)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="voucheeEmail">Vouchee Email *</Label>
                  <Input
                    id="voucheeEmail"
                    type="email"
                    value={formData.voucheeEmail}
                    onChange={(e) => updateField("voucheeEmail", e.target.value)}
                    placeholder="vouchee@company.com"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must match an existing profile email
                  </p>
                </div>

                {/* Vouchee Profile Preview */}
                {voucheeProfile && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={voucheeProfile.photo}
                        alt={voucheeProfile.name}
                        className="object-cover object-center"
                      />
                      <AvatarFallback className="text-xs font-semibold bg-vouch-100 text-vouch-600">
                        {getInitials(voucheeProfile.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm">{voucheeProfile.name}</div>
                      <div className="text-xs text-gray-600">{voucheeProfile.title}</div>
                      {voucheeProfile.company && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {voucheeProfile.company}
                        </Badge>
                      )}
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                  </div>
                )}

                {formData.voucheeEmail.trim() && !voucheeProfile && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    No profile found with this email
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transcript Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Transcript Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="content">Transcript Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => updateField("content", e.target.value)}
                    placeholder="Paste the full transcript content here. Use double line breaks to separate paragraphs..."
                    className="min-h-[200px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="interviewDate">Interview Date (optional)</Label>
                    <Input
                      id="interviewDate"
                      type="date"
                      value={formData.interviewDate}
                      onChange={(e) => updateField("interviewDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="interviewedBy">Interviewed By (optional)</Label>
                    <Input
                      id="interviewedBy"
                      value={formData.interviewedBy}
                      onChange={(e) => updateField("interviewedBy", e.target.value)}
                      placeholder="e.g., Sarah Johnson, HR Partner"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Actions */}
          <div className="p-6 border-t border-gray-200">
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
                    Saving...
                  </>
                ) : submitStatus === "success" ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Transcript
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
