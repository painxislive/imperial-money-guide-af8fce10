import { ReactNode } from 'react';
import { useRole } from '@/hooks/useRole';
import { AppRole } from '@/types/database';

// AUTH BYPASS: Set to true for testing without login
const AUTH_BYPASS = true;

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AppRole | AppRole[];
  requirePremium?: boolean;
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  // When AUTH_BYPASS is true, skip all auth checks
  if (AUTH_BYPASS) {
    return <>{children}</>;
  }

  // Original auth logic preserved below for production use
  const { role, isAdmin, isEditor, isPremium, loading } = useRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
