import React, { ReactNode, useEffect } from 'react';
import { useUser } from '../user-context/user-context';
import { useNavigate } from 'react-router-dom';

interface ProtectedPageProps {
  children: ReactNode;
}

/**
 * Component wrapper for protected components
 * @param props: { children: ReactNode }
 * @returns ProtectedRoute react component
 */
export function ProtectedPage(props: ProtectedPageProps) {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading) {
     // Replace with loading page if needed
    return <div>Loading...</div>;
  }

  return user ? <>{props.children}</> : null;
}