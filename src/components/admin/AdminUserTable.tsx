
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, AlertTriangle } from 'lucide-react';
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

interface AdminUserTableProps {
  profiles: Profile[];
  roleFilter: RoleFilter;
  processingRoleChange: string | null;
  currentUserId?: string;
  onRoleChange: (userId: string, email: string, newRole: 'admin' | 'client') => void;
}

export const AdminUserTable = ({ 
  profiles, 
  roleFilter, 
  processingRoleChange, 
  currentUserId,
  onRoleChange 
}: AdminUserTableProps) => {
  const filteredProfiles = profiles.filter(profile => {
    if (roleFilter === 'all') return true;
    return profile.role === roleFilter;
  });

  return (
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
                      {userProfile.id !== currentUserId ? (
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
                                onClick={() => onRoleChange(
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
  );
};
