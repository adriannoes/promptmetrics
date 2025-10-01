import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Search, RefreshCw, Shield, User, Settings, Zap, Key, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  table_name: string | null;
  record_id: string | null;
  old_values: any;
  new_values: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string;
  };
}

const AuditLogsDashboard = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('7'); // days
  const { profile } = useAuth();

  // Only render if current user is admin
  if (profile?.role !== 'admin') {
    return null;
  }

  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);

      // Optimize query to select only needed fields
      let query = supabase
        .from('audit_logs')
        .select(`
          id,
          user_id,
          action,
          table_name,
          record_id,
          old_values,
          new_values,
          ip_address,
          user_agent,
          created_at,
          profiles:user_id (
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100); // Limit results for better performance

      // Apply date filter
      if (dateFilter !== 'all') {
        const days = parseInt(dateFilter);
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - days);
        query = query.gte('created_at', dateThreshold.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      setLogs((data || []) as any);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [dateFilter]);

  useEffect(() => {
    fetchAuditLogs();
  }, [dateFilter, fetchAuditLogs]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = !searchTerm ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.table_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction = actionFilter === 'all' || log.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [logs, searchTerm, actionFilter]);

  const getActionIcon = useCallback((action: string) => {
    switch (action) {
      case 'user_login_success':
      case 'user_login_failed':
        return <User className="w-4 h-4" />;
      case 'user_signup_success':
      case 'user_signup_failed':
        return <User className="w-4 h-4" />;
      case 'user_role_changed':
        return <Settings className="w-4 h-4" />;
      case 'invite_code_created':
      case 'invite_code_used':
        return <Key className="w-4 h-4" />;
      case 'domain_analysis_success':
      case 'domain_analysis_failed':
        return <Zap className="w-4 h-4" />;
      case 'admin_panel_accessed':
        return <Shield className="w-4 h-4" />;
      case 'unauthorized_access_attempt':
        return <Eye className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  }, []);

  const getActionBadgeVariant = useCallback((action: string): "default" | "secondary" | "destructive" | "outline" => {
    if (action.includes('success') || action.includes('login_success') || action.includes('signup_success')) {
      return 'default';
    }
    if (action.includes('failed') || action.includes('login_failed') || action.includes('signup_failed')) {
      return 'destructive';
    }
    if (action.includes('unauthorized')) {
      return 'destructive';
    }
    return 'secondary';
  }, []);

  const formatAction = useCallback((action: string): string => {
    return action
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }, []);

  const uniqueActions = useMemo(() => Array.from(new Set(logs.map(log => log.action))), [logs]);

  // Memoizar estatísticas para evitar recálculos desnecessários
  const stats = useMemo(() => ({
    total: logs.length,
    success: logs.filter(log => log.action.includes('success')).length,
    failed: logs.filter(log => log.action.includes('failed')).length,
    security: logs.filter(log => log.action.includes('unauthorized')).length
  }), [logs]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Audit Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {uniqueActions.map(action => (
                <SelectItem key={action} value={action}>
                  {formatAction(action)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last 24h</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={fetchAuditLogs} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Logs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.success}</div>
              <div className="text-sm text-muted-foreground">Success Actions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-muted-foreground">Failed Actions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.security}</div>
              <div className="text-sm text-muted-foreground">Security Events</div>
            </CardContent>
          </Card>
        </div>

        {/* Logs Table */}
        {loading ? (
          <div className="text-center py-8">Loading audit logs...</div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Type</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {getActionIcon(log.action)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {formatAction(log.action)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {log.profiles?.full_name || 'Unknown User'}
                        </div>
                        <div className="text-muted-foreground">
                          {log.profiles?.email || 'No email'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        {log.table_name && (
                          <div>Table: <code className="bg-muted px-1 rounded text-xs">{log.table_name}</code></div>
                        )}
                        {log.new_values && Object.keys(log.new_values).length > 0 && (
                          <div>Changes: {Object.keys(log.new_values).join(', ')}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No audit logs found matching your filters.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogsDashboard;

