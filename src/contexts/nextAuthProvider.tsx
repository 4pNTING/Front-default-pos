'use client';

// Third-party Imports
import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import type { SessionProviderProps } from 'next-auth/react';

export const NextAuthProvider = ({
  children,
  ...rest
}: SessionProviderProps) => {
  useEffect(() => {
    console.log('[NextAuthProvider] mounted');
    return () => {
      console.log('[NextAuthProvider] unmounted');
    };
  }, []);

  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0} {...rest}>
      {children}
    </SessionProvider>
  );
};
