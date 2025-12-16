import React from 'react';
import CatBot from './components/CatBot/CatBot';
import { AuthProvider } from './components/Auth/AuthContext';
import { ClerkProvider } from '@clerk/clerk-react';
import { clerkConfig } from './components/Auth/clerk';

// This is the root wrapper for the entire app
// It will render the CatBot on all pages and provide authentication context
export default function Root({children}) {
  return (
    <ClerkProvider publishableKey={clerkConfig.publishableKey}>
      <AuthProvider>
        {children}
        <CatBot />
      </AuthProvider>
    </ClerkProvider>
  );
}