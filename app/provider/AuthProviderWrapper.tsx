'use client';

import { AuthProvider } from '@/app/features/auth/AuthContext';

export default function AuthProviderWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
