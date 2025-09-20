
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck } from 'lucide-react';

interface AdminUserStatsProps {
  totalUsers: number;
  adminCount: number;
  clientCount: number;
}

export const AdminUserStats = ({ totalUsers, adminCount, clientCount }: AdminUserStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalUsers}</p>
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
  );
};
