import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  X,
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  transcriptId: string;
  speakerName: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  transcriptId,
  speakerName,
}: PaymentModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Verify Transcript
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transcript Info */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Transcript by {speakerName}
                  </h4>
                  <p className="text-sm text-gray-600">ID: {transcriptId}</p>
                </div>
                <Badge variant="outline">Verification</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Display */}
          <div className="border rounded-lg p-6 text-center">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Transcript Verification
              </h3>
              <div className="text-4xl font-bold text-blue-600">$19.00</div>
              <p className="text-sm text-gray-600">One-time payment</p>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">
                  Verification Process
                </h4>
                <p className="text-sm text-blue-800">
                  Professional transcript verification ensures authenticity and credibility for your testimonials.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button onClick={onClose} className="w-full" size="lg">
              Close
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>💡 Payment integration coming soon</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
