
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, AlertTriangle, User, Key, RefreshCw } from 'lucide-react';

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  old_values: any;
  new_values: any;
  created_at: string;
}

interface LoginAttempt {
  id: string;
  email: string;
  success: boolean;
  attempted_at: string;
}

const SecurityAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  // Garante ordem estável de hooks

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    setLoading(true);
    try {
      // Fetch audit logs
      const { data: auditData, error: auditError } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (auditError) throw auditError;

      // Fetch recent login attempts
      const { data: loginData, error: loginError } = await supabase
        .from('login_attempts')
        .select('*')
        .order('attempted_at', { ascending: false })
        .limit(100);

      if (loginError) throw loginError;

      setAuditLogs(auditData || []);
      setLoginAttempts(loginData || []);
    } catch (error) {
      console.error('Error fetching security data:', error);
      toast.error('Failed to load security audit data');
    } finally {
      setLoading(false);
    }
  };

  const formatJsonValue = (value: any) => {
    if (!value) return '-';
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'role_change':
        return <User className="w-4 h-4 text-orange-600" />;
      case 'user_created':
        return <User className="w-4 h-4 text-green-600" />;
      default:
        return <Shield className="w-4 h-4 text-blue-600" />;
    }
  };

  const failedLoginAttempts = loginAttempts.filter(attempt => !attempt.success);
  const successfulLogins = loginAttempts.filter(attempt => attempt.success);

  if (profile?.role !== 'admin') {
    return null;
  }
  if (loading) {
    return <div className="p-4">Loading security audit data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{auditLogs.length}</p>
                <p className="text-sm text-slate-600">Audit Events</p>
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
                <p className="text-2xl font-bold text-slate-900">{successfulLogins.length}</p>
                <p className="text-sm text-slate-600">Successful Logins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{failedLoginAttempts.length}</p>
                <p className="text-sm text-slate-600">Failed Logins</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={fetchSecurityData}
                size="sm"
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {auditLogs.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No audit logs found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span className="font-medium">{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>{log.table_name || '-'}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {log.old_values && (
                            <div className="text-xs text-red-600">
                              <strong>From:</strong> {formatJsonValue(log.old_values)}
                            </div>
                          )}
                          {log.new_values && (
                            <div className="text-xs text-green-600">
                              <strong>To:</strong> {formatJsonValue(log.new_values)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Login Attempts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Recent Login Attempts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loginAttempts.length === 0 ? (
            <div className="text-center py-8">
              <Key className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No login attempts recorded.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loginAttempts.slice(0, 20).map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell className="font-medium">{attempt.email}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          attempt.success 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {attempt.success ? 'Success' : 'Failed'}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(attempt.attempted_at).toLocaleString()}</TableCell>
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

export default SecurityAuditLogs;
