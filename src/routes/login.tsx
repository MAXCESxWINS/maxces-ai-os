import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { AuroraBackground } from '@/components/maxces/AuroraBackground';
import { AuthCard } from '@/components/auth/AuthCard';
import { useAuth } from '@/hooks/useAuth';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, automatically redirect to home dashboard
  useEffect(() => {
    if (!isLoading && user) {
      navigate({ to: '/' });
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      {/* Decorative Aurora Background */}
      <AuroraBackground />

      {/* Auth Form Card */}
      <div className="z-10 w-full max-w-md">
        <AuthCard />
      </div>
    </div>
  );
}
