
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { AdminUserStats } from '@/components/admin/AdminUserStats';
import { AdminRoleFilter } from '@/components/admin/AdminRoleFilter';
import { AdminUserTable } from '@/components/admin/AdminUserTable';
import { AdminPromoteUser } from '@/components/admin/AdminPromoteUser';

type RoleFilter = 'all' | 'client' | 'admin';

const AdminUserManagement = () => {
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const { profile, userRole } = useAuth();
  const {
    profiles,
    loading,
    processingRoleChange,
    adminCount,
    clientCount,
    handleRoleChange,
    promoteByEmail
  } = useAdminUsers();

  // Only render if current user is admin
  if (userRole?.role !== 'admin') {
    return null;
  }

  if (loading) {
    return <div className="p-4">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <AdminUserStats 
        totalUsers={profiles.length}
        adminCount={adminCount}
        clientCount={clientCount}
      />

      <AdminRoleFilter
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        totalUsers={profiles.length}
        adminCount={adminCount}
        clientCount={clientCount}
      />

      <AdminUserTable
        profiles={profiles}
        roleFilter={roleFilter}
        processingRoleChange={processingRoleChange}
        currentUserId={profile?.id}
        onRoleChange={handleRoleChange}
      />

      <AdminPromoteUser onPromoteByEmail={promoteByEmail} />
    </div>
  );
};

export default AdminUserManagement;
