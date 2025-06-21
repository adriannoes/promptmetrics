
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'client' | 'admin';
  created_at: string;
}

const AdminUserManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailToPromote, setEmailToPromote] = useState('');
  const { profile } = useAuth();

  // Only render if current user is admin
  if (profile?.role !== 'admin') {
    return null;
  }

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load user profiles');
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async (userId: string, email: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin', updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`Successfully promoted ${email} to admin`);
      fetchProfiles();
    } catch (error) {
      console.error('Error promoting user:', error);
      toast.error('Failed to promote user to admin');
    }
  };

  const demoteFromAdmin = async (userId: string, email: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'client', updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`Successfully demoted ${email} to client`);
      fetchProfiles();
    } catch (error) {
      console.error('Error demoting user:', error);
      toast.error('Failed to demote user');
    }
  };

  const promoteByEmail = async () => {
    if (!emailToPromote.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: 'admin', updated_at: new Date().toISOString() })
        .eq('email', emailToPromote.trim())
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        toast.success(`Successfully promoted ${emailToPromote} to admin`);
        setEmailToPromote('');
        fetchProfiles();
      } else {
        toast.error('User not found. Make sure they have signed up first.');
      }
    } catch (error) {
      console.error('Error promoting user by email:', error);
      toast.error('Failed to promote user to admin');
    }
  };

  if (loading) {
    return <div className="p-4">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
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
          <Button onClick={promoteByEmail} className="w-full">
            Promote to Admin
          </Button>
          <div className="text-sm text-slate-600">
            <p>Quick promote these users to admin once they sign up:</p>
            <ul className="list-disc list-inside mt-2">
              <li>esadrianno@gmail.com</li>
              <li>almeidamarcell@gmail.com</li>
              <li>raphael.farinazzo@gmail.com</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({profiles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{profile.full_name}</div>
                  <div className="text-sm text-slate-600">{profile.email}</div>
                  <div className="text-xs text-slate-500">
                    Role: {profile.role} | Joined: {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  {profile.role === 'client' ? (
                    <Button
                      onClick={() => promoteToAdmin(profile.id, profile.email)}
                      size="sm"
                      variant="outline"
                    >
                      Make Admin
                    </Button>
                  ) : (
                    <Button
                      onClick={() => demoteFromAdmin(profile.id, profile.email)}
                      size="sm"
                      variant="outline"
                    >
                      Remove Admin
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagement;
