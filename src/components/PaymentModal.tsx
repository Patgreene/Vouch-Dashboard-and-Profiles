import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, X } from "lucide-react";

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
  console.log(
    "PaymentModal rendered with isOpen:",
    isOpen,
    "transcriptId:",
    transcriptId,
  );
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <div className="text-center space-y-4 py-2">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Verify Transcript
            </h3>
            <p className="text-sm text-gray-600">by {speakerName}</p>
          </div>

          <div className="py-2">
            <div className="text-3xl font-bold text-blue-600 mb-1">$19</div>
            <p className="text-sm text-gray-600">One-time payment</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
            ✓ Professional verification
            <br />✓ 2-3 days processing time
          </div>

          <Button onClick={onClose} className="w-full mt-4">
            Pay Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
