
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Users, UserCheck, Filter } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'client' | 'admin';
  created_at: string;
}

type RoleFilter = 'all' | 'client' | 'admin';

const AdminUserManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailToPromote, setEmailToPromote] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
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

  const filteredProfiles = profiles.filter(profile => {
    if (roleFilter === 'all') return true;
    return profile.role === roleFilter;
  });

  const adminCount = profiles.filter(p => p.role === 'admin').length;
  const clientCount = profiles.filter(p => p.role === 'client').length;

  if (loading) {
    return <div className="p-4">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{profiles.length}</p>
                <p className="text-sm text-slate-600">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{adminCount}</p>
                <p className="text-sm text-slate-600">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{clientCount}</p>
                <p className="text-sm text-slate-600">Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Users by Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={roleFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setRoleFilter('all')}
              size="sm"
            >
              All ({profiles.length})
            </Button>
            <Button
              variant={roleFilter === 'client' ? 'default' : 'outline'}
              onClick={() => setRoleFilter('client')}
              size="sm"
            >
              Clients ({clientCount})
            </Button>
            <Button
              variant={roleFilter === 'admin' ? 'default' : 'outline'}
              onClick={() => setRoleFilter('admin')}
              size="sm"
            >
              Admins ({adminCount})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {roleFilter === 'all' ? 'All Users' : `${roleFilter === 'admin' ? 'Admin' : 'Client'} Users`} 
            ({filteredProfiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No users found for the selected filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">{profile.full_name}</TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          profile.role === 'admin' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {profile.role}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Promote User Section */}
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
    </div>
  );
};

export default AdminUserManagement;
