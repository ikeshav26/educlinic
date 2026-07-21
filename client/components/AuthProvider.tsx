'use client';

import React, { useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return <>{children}</>;
}
