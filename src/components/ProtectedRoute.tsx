import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import { AppRole } from '@/types/database';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AppRole | AppRole[];
  requirePremium?: boolean;
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requirePremium = false,
  fallbackPath = '/login',
}: ProtectedRouteProps) {
  const { role, isAdmin, isEditor, isPremium, loading } = useRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user is authenticated at all
  if (!role) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check role requirements
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    const hasRequiredRole = roles.some(r => {
      if (r === 'admin') return isAdmin;
      if (r === 'editor') return isEditor; // editors also get admin permissions
      if (r === 'user') return true; // all authenticated users are at least 'user'
      return false;
    });

    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  // Check premium requirement
  if (requirePremium && !isPremium && !isAdmin) {
    return <Navigate to="/pricing" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
