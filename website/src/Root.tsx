import React from 'react';
import { AuthProvider } from './components/Auth/AuthContext';
import { ClerkProvider } from '@clerk/clerk-react';
import { clerkConfig } from './components/Auth/clerk';

// This is the root wrapper for the entire app
// It provides authentication context for the entire application
export default function Root({children}) {
  return (
    <ClerkProvider publishableKey={clerkConfig.publishableKey}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ClerkProvider>
  );
}