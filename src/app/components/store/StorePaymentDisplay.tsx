import { Card } from '../ui/card';
import { Smartphone, CreditCard, Building2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { copyToClipboard } from '../../utils/clipboard';
import { toast } from 'sonner';

interface PaymentMethod {
  type: 'upi' | 'qr' | 'bank';
  details: {
    upiId?: string;
    qrImage?: string;
    accountName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    branch?: string;
  };
}

interface StorePaymentDisplayProps {
  storeName?: string;
  paymentMethods?: PaymentMethod[];
}

export function StorePaymentDisplay({ 
  storeName = 'Sthiroot Health Store',
  paymentMethods = [
    {
      type: 'upi',
      details: {
        upiId: 'sthiroot.delhi@paytm',
      },
    },
    {
      type: 'bank',
      details: {
        accountName: 'Sthiroot Health Store',
        accountNumber: '1234567890',
        ifscCode: 'HDFC0001234',
        bankName: 'HDFC Bank',
        branch: 'Green Park, New Delhi',
      },
    },
  ]
}: StorePaymentDisplayProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(field);
      toast.success(`Copied ${field} to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } else {
      toast.error(`Failed to copy ${field}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Payment Methods</h3>
        <p className="text-sm text-muted-foreground">{storeName}</p>
      </div>

      {paymentMethods.map((method, index) => (
        <Card key={index} className="p-4">
          {method.type === 'upi' && (
            <div className="flex items-start gap-3">
              <div className="bg-emerald-50 p-3 rounded-lg">
                <Smartphone className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-2">UPI Payment</h4>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-gray-50 rounded border text-sm">
                    {method.details.upiId}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(method.details.upiId || '', 'upi')}
                  >
                    {copiedField === 'upi' ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {method.type === 'qr' && (
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-2">QR Code Payment</h4>
                <div className="bg-gray-50 border rounded p-4 flex items-center justify-center">
                  {method.details.qrImage ? (
                    <img src={method.details.qrImage} alt="QR Code" className="max-w-[200px]" />
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">QR Code not available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {method.type === 'bank' && (
            <div className="flex items-start gap-3">
              <div className="bg-purple-50 p-3 rounded-lg">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-3">Bank Transfer</h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Account Name:</span>
                    <span className="font-medium">{method.details.accountName}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Account Number:</span>
                    <div className="flex items-center gap-2">
                      <code className="font-medium font-mono">{method.details.accountNumber}</code>
                      <button
                        onClick={() => handleCopy(method.details.accountNumber || '', 'account')}
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        {copiedField === 'account' ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">IFSC Code:</span>
                    <div className="flex items-center gap-2">
                      <code className="font-medium font-mono">{method.details.ifscCode}</code>
                      <button
                        onClick={() => handleCopy(method.details.ifscCode || '', 'ifsc')}
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        {copiedField === 'ifsc' ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Bank Name:</span>
                    <span className="font-medium">{method.details.bankName}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Branch:</span>
                    <span className="font-medium">{method.details.branch}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}