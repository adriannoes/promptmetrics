
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket, Plus, Trash2, Key } from 'lucide-react';

interface InvitationCode {
  id: string;
  code: string;
  used: boolean;
  used_by: string | null;
  created_at: string;
  used_at: string | null;
}

const AdminInvitationCodes = () => {
  const [codes, setCodes] = useState<InvitationCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { profile } = useAuth();

  // Render gating via early return after effects are defined para evitar hooks condicionais

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('invitation_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCodes(data || []);
    } catch (error) {
      console.error('Error fetching invitation codes:', error);
      toast.error('Failed to load invitation codes');
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const createCode = async () => {
    setCreating(true);
    try {
      let newCode = generateCode();
      let attempts = 0;
      const maxAttempts = 10;

      // Ensure code uniqueness
      while (attempts < maxAttempts) {
        const { data: existingCode } = await supabase
          .from('invitation_codes')
          .select('id')
          .eq('code', newCode)
          .single();

        if (!existingCode) break;
        
        newCode = generateCode();
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error('Failed to generate unique code after multiple attempts');
      }

      const { error } = await supabase
        .from('invitation_codes')
        .insert([{ code: newCode }]);

      if (error) throw error;

      toast.success(`New invitation code "${newCode}" created successfully!`);
      fetchCodes();
    } catch (error) {
      console.error('Error creating invitation code:', error);
      toast.error('Failed to create invitation code');
    } finally {
      setCreating(false);
    }
  };

  const revokeCode = async (id: string, code: string) => {
    try {
      const { error } = await supabase
        .from('invitation_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success(`Invitation code "${code}" has been revoked`);
      fetchCodes();
    } catch (error) {
      console.error('Error revoking invitation code:', error);
      toast.error('Failed to revoke invitation code');
    }
  };

  const usedCodes = codes.filter(code => code.used).length;
  const availableCodes = codes.filter(code => !code.used).length;

  if (profile?.role !== 'admin') {
    return null;
  }
  if (loading) {
    return <div className="p-4">Loading invitation codes...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Ticket className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{codes.length}</p>
                <p className="text-sm text-slate-600">Total Codes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{availableCodes}</p>
                <p className="text-sm text-slate-600">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Ticket className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{usedCodes}</p>
                <p className="text-sm text-slate-600">Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create New Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Invitation Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={createCode} 
            disabled={creating}
            className="w-full"
          >
            {creating ? 'Creating...' : 'Generate New Code'}
          </Button>
          <p className="text-sm text-slate-600 mt-2">
            Generates a unique 6-character alphanumeric code (e.g., A7XK4R)
          </p>
        </CardContent>
      </Card>

      {/* Codes Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Invitation Codes ({codes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {codes.length === 0 ? (
            <div className="text-center py-8">
              <Ticket className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No invitation codes found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Used Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell className="font-mono font-medium text-lg">
                        {code.code}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          code.used 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {code.used ? 'Used' : 'Available'}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(code.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {code.used_at ? new Date(code.used_at).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        {!code.used ? (
                          <Button
                            onClick={() => revokeCode(code.id, code.code)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Revoke
                          </Button>
                        ) : (
                          <span className="text-sm text-slate-500">-</span>
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
    </div>
  );
};

export default AdminInvitationCodes;
