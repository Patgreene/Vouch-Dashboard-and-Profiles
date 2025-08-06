import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Shield,
  CheckCircle,
  Loader2,
  X,
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transcriptId: string;
  speakerName: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  transcriptId,
  speakerName,
}: PaymentModalProps) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Mock payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setProcessing(false);
    setSuccess(true);

    // Wait a moment to show success, then call onSuccess
    setTimeout(() => {
      onSuccess();
      onClose();
      setSuccess(false);
      setFormData({
        email: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        name: "",
      });
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600 mb-4">
              Transcript verification has been initiated. You'll receive an
              email confirmation shortly.
            </p>
            <Badge className="bg-green-100 text-green-800">
              Status: Pending Verification
            </Badge>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
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

          {/* Pricing */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Transcript Verification</span>
              <span className="font-semibold">$19.00</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
              <span>One-time payment</span>
              <span>USD</span>
            </div>
            <div className="border-t mt-3 pt-3">
              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span className="text-lg">$19.00</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="name">Cardholder Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) =>
                    handleInputChange(
                      "cardNumber",
                      formatCardNumber(e.target.value),
                    )
                  }
                  maxLength={19}
                  required
                />
                <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    handleInputChange(
                      "expiryDate",
                      formatExpiryDate(e.target.value),
                    )
                  }
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) =>
                    handleInputChange("cvv", e.target.value.replace(/\D/g, ""))
                  }
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={processing}
                size="lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Pay $19.00 & Verify
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="text-xs text-gray-500 text-center">
            <p>
              🔒 Secure payment powered by industry-standard encryption
            </p>
            <p className="mt-1">
              This is a demo payment form. No actual charges will be made.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
