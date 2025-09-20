
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminPromoteUserProps {
  onPromoteByEmail: (email: string) => Promise<boolean>;
}

export const AdminPromoteUser = ({ onPromoteByEmail }: AdminPromoteUserProps) => {
  const [emailToPromote, setEmailToPromote] = useState('');

  const handlePromote = async () => {
    const success = await onPromoteByEmail(emailToPromote);
    if (success) {
      setEmailToPromote('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promote User to Admin</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter user email"
            value={emailToPromote}
            onChange={(e) => setEmailToPromote(e.target.value)}
          />
        </div>
        <Button onClick={handlePromote} className="w-full">
          Promote to Admin
        </Button>
      </CardContent>
    </Card>
  );
};
