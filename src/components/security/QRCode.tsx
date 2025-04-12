import React from 'react';
import QRCode from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

interface QRCodeProps {
  secret: string;
  email: string;
}

const QRCodeComponent: React.FC<QRCodeProps> = ({ secret, email }) => {
  const otpauthUrl = `otpauth://totp/Gridwise:${email}?secret=${secret}&issuer=Gridwise`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Setup Two-Factor Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-md">
            <QRCode
              value={otpauthUrl}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Scan this QR code with your authenticator app
            </p>
            <p className="text-sm text-muted-foreground">
              Or enter this code manually:
            </p>
            <div className="flex items-center gap-2">
              <Input
                value={secret}
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(secret)}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Verification Code</Label>
          <Input
            placeholder="Enter 6-digit code from your authenticator app"
            maxLength={6}
          />
        </div>
        <Button className="w-full">Verify and Enable 2FA</Button>
      </CardContent>
    </Card>
  );
};

export default QRCodeComponent; 