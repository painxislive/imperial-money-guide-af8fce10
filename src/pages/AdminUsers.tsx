import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/hooks/useRole';
import { db } from '@/lib/supabase-helpers';
import { AppRole } from '@/types/database';
import { SEO } from '@/utils/seo';
import { Users, Shield, Search, Edit, UserCog } from 'lucide-react';

interface UserWithRole {
  id: string;
  user_id: string;
  full_name: string | null;
  membership_type: string;
  created_at: string;
  roles: AppRole[];
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: roleLoading } = useRole();
  
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AppRole>('user');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate('/');
      return;
    }
    
    if (!roleLoading && isAdmin) {
      loadUsers();
    }
  }, [roleLoading, isAdmin]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Get all profiles
      const { data: profiles, error: profileError } = await db('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileError) throw profileError;

      // Get all roles
      const { data: roles, error: roleError } = await db('user_roles')
        .select('*');

      if (roleError) throw roleError;

      // Combine data
      const usersWithRoles: UserWithRole[] = (profiles || []).map((profile: any) => ({
        id: profile.id,
        user_id: profile.user_id,
        full_name: profile.full_name,
        membership_type: profile.membership_type || 'free',
        created_at: profile.created_at,
        roles: (roles || [])
          .filter((r: any) => r.user_id === profile.user_id)
          .map((r: any) => r.role as AppRole),
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getHighestRole = (roles: AppRole[]): AppRole => {
    if (roles.includes('admin')) return 'admin';
    if (roles.includes('editor')) return 'editor';
    return 'user';
  };

  const openEditDialog = (user: UserWithRole) => {
    setEditingUser(user);
    setSelectedRole(getHighestRole(user.roles));
    setShowEditDialog(true);
  };

  const handleSaveRole = async () => {
    if (!editingUser) return;

    setSaving(true);
    try {
      // Delete existing roles for this user
      await db('user_roles')
        .delete()
        .eq('user_id', editingUser.user_id);

      // Insert new role
      const { error } = await db('user_roles')
        .insert({
          user_id: editingUser.user_id,
          role: selectedRole,
        });

      if (error) throw error;

      toast({ title: 'Success', description: 'User role updated successfully.' });
      setShowEditDialog(false);
      loadUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePremium = async (user: UserWithRole) => {
    try {
      const newType = user.membership_type === 'premium' ? 'free' : 'premium';
      
      const { error } = await db('profiles')
        .update({ membership_type: newType })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `User is now ${newType}.`,
      });
      loadUsers();
    } catch (error) {
      console.error('Error updating membership:', error);
      toast({
        title: 'Error',
        description: 'Failed to update membership.',
        variant: 'destructive',
      });
    }
  };

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="User Management | Admin | Imperialpedia" />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">
              Manage user roles and permissions • {users.length} users
            </p>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.roles.includes('admin')).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Admins</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.roles.includes('editor')).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Editors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <UserCog className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.membership_type === 'premium').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Premium</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map(user => {
            const highestRole = getHighestRole(user.roles);
            return (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {(user.full_name || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.full_name || 'Unnamed User'}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {user.user_id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <Badge variant={
                          highestRole === 'admin' ? 'destructive' :
                          highestRole === 'editor' ? 'default' : 'secondary'
                        }>
                          {highestRole}
                        </Badge>
                        {user.membership_type === 'premium' && (
                          <Badge variant="outline" className="border-warning text-warning">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePremium(user)}
                        >
                          {user.membership_type === 'premium' ? 'Remove Premium' : 'Make Premium'}
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                        >
                          Change Role
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {filteredUsers.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No users found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Edit Role Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Changing role for: <strong>{editingUser?.full_name || 'Unnamed User'}</strong>
            </p>
            
            <div>
              <label className="text-sm font-medium">Role</label>
              <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User - Can read content</SelectItem>
                  <SelectItem value="editor">Editor - Can create/edit articles</SelectItem>
                  <SelectItem value="admin">Admin - Full access</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted p-3 rounded-lg text-sm">
              <p className="font-medium mb-2">Role Permissions:</p>
              <ul className="space-y-1 text-muted-foreground">
                {selectedRole === 'user' && (
                  <>
                    <li>• Read free articles</li>
                    <li>• View premium article previews</li>
                    <li>• Save bookmarks</li>
                  </>
                )}
                {selectedRole === 'editor' && (
                  <>
                    <li>• All user permissions</li>
                    <li>• Create and edit articles</li>
                    <li>• Save drafts</li>
                    <li>• Manage glossary terms</li>
                  </>
                )}
                {selectedRole === 'admin' && (
                  <>
                    <li>• All editor permissions</li>
                    <li>• Publish/unpublish articles</li>
                    <li>• Delete articles</li>
                    <li>• Manage users and roles</li>
                    <li>• Generate secure edit links</li>
                  </>
                )}
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveRole} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminUsers;
