
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter } from 'lucide-react';

type RoleFilter = 'all' | 'client' | 'admin';

interface AdminRoleFilterProps {
  roleFilter: RoleFilter;
  setRoleFilter: (filter: RoleFilter) => void;
  totalUsers: number;
  adminCount: number;
  clientCount: number;
}

export const AdminRoleFilter = ({ 
  roleFilter, 
  setRoleFilter, 
  totalUsers, 
  adminCount, 
  clientCount 
}: AdminRoleFilterProps) => {
  return (
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
            All ({totalUsers})
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
  );
};
