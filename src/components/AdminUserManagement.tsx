import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Users, UserCheck, Filter, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
  const [processingRoleChange, setProcessingRoleChange] = useState<string | null>(null);
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
      
      // Type assert the data to ensure role is properly typed
      const typedProfiles = (data || []).map(profile => ({
        ...profile,
        role: profile.role as 'client' | 'admin'
      }));
      
      setProfiles(typedProfiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load user profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, email: string, newRole: 'admin' | 'client') => {
    if (userId === profile?.id) {
      toast.error('You cannot change your own role');
      return;
    }

    setProcessingRoleChange(userId);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      const action = newRole === 'admin' ? 'promoted' : 'demoted';
      toast.success(`Successfully ${action} ${email} to ${newRole}`);
      fetchProfiles();
    } catch (error) {
      console.error('Error changing user role:', error);
      toast.error(`Failed to change user role`);
    } finally {
      setProcessingRoleChange(null);
    }
  };

  const promoteByEmail = async () => {
    if (!emailToPromote.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToPromote.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }

    const sanitizedEmail = emailToPromote.trim().toLowerCase();

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: 'admin', updated_at: new Date().toISOString() })
        .eq('email', sanitizedEmail)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        toast.success(`Successfully promoted ${sanitizedEmail} to admin`);
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
                  {filteredProfiles.map((userProfile) => (
                    <TableRow key={userProfile.id}>
                      <TableCell className="font-medium">{userProfile.full_name}</TableCell>
                      <TableCell>{userProfile.email}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          userProfile.role === 'admin' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {userProfile.role}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(userProfile.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {userProfile.id !== profile?.id ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={processingRoleChange === userProfile.id}
                              >
                                {processingRoleChange === userProfile.id ? (
                                  'Processing...'
                                ) : userProfile.role === 'client' ? (
                                  'Make Admin'
                                ) : (
                                  'Remove Admin'
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                                  Confirm Role Change
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to {userProfile.role === 'client' ? 'promote' : 'demote'} {userProfile.full_name} ({userProfile.email}) {userProfile.role === 'client' ? 'to admin' : 'to client'}?
                                  {userProfile.role === 'admin' && (
                                    <span className="block mt-2 text-red-600 font-medium">
                                      This will remove their admin privileges and they will lose access to the admin panel.
                                    </span>
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRoleChange(
                                    userProfile.id, 
                                    userProfile.email, 
                                    userProfile.role === 'client' ? 'admin' : 'client'
                                  )}
                                  className="bg-orange-600 hover:bg-orange-700"
                                >
                                  {userProfile.role === 'client' ? 'Promote' : 'Demote'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <span className="text-sm text-slate-500">You</span>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagement;
