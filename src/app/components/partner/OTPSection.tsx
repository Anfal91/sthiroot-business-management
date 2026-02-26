import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { RefreshCw, Copy, CheckCheck, Shield, Info } from 'lucide-react';
import { toast } from 'sonner';

export function OTPSection() {
  const [otp, setOtp] = useState<string>(generateOTP());
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate random 6-digit OTP
  function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Handle OTP refresh
  const handleRefreshOTP = async () => {
    setIsRefreshing(true);
    
    // Simulate API call to backend
    // In real app: await api.post('/partner/generate-otp')
    setTimeout(() => {
      const newOTP = generateOTP();
      setOtp(newOTP);
      setIsRefreshing(false);
      setCopied(false);
      toast.success('OTP refreshed successfully!');
    }, 500);
  };

  // Handle copy to clipboard with fallback
  const handleCopyOTP = () => {
    // Fallback method that works without Clipboard API permissions
    const textArea = document.createElement('textarea');
    textArea.value = otp;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        toast.success('OTP copied to clipboard!');
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } else {
        toast.error('Failed to copy OTP. Please copy manually.');
      }
    } catch (err) {
      console.error('Copy failed:', err);
      toast.error('Failed to copy OTP. Please copy manually.');
    } finally {
      document.body.removeChild(textArea);
    }
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="size-5 text-blue-600" />
          Partner OTP Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info Banner */}
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 flex items-start gap-3">
          <Info className="size-5 text-blue-700 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">What is this OTP for?</p>
            <p className="text-blue-800">
              This secure OTP can be used to authorize actions on your behalf, such as order placements, 
              RP transfers, or other partner-specific operations. It remains valid until you manually refresh it.
            </p>
          </div>
        </div>

        {/* OTP Display Card */}
        <div className="bg-white rounded-lg border-2 border-blue-300 p-6 shadow-sm">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Current OTP</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                {otp.split('').map((digit, index) => (
                  <div
                    key={index}
                    className="size-12 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-2xl font-bold rounded-lg shadow-md"
                  >
                    {digit}
                  </div>
                ))}
              </div>
              <Badge className="bg-green-600 text-white">
                Active • Never Expires
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full">
              <Button
                onClick={handleCopyOTP}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {copied ? (
                  <>
                    <CheckCheck className="size-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="size-4 mr-2" />
                    Copy OTP
                  </>
                )}
              </Button>

              <Button
                onClick={handleRefreshOTP}
                variant="outline"
                size="lg"
                className="flex-1 border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                disabled={isRefreshing}
              >
                <RefreshCw className={`size-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh OTP
              </Button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
          <p className="text-xs text-amber-900 flex items-center gap-2">
            <Shield className="size-4" />
            <span>
              <strong>Security Reminder:</strong> Never share this OTP with anyone you don't trust. 
              This OTP grants access to perform operations on your behalf.
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}