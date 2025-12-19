import React from 'react';
import ChatBot from '@site/src/components/ChatBot';
import { AuthProvider } from '@site/src/components/Auth/AuthContext';
import { ClerkProvider } from '@clerk/clerk-react';
import { clerkConfig } from '@site/src/components/Auth/clerk';

// Default implementation, that you can customize
export default function Root({ children }) {
  return (
    <ClerkProvider publishableKey={clerkConfig.publishableKey}>
      <AuthProvider>
        {children}
        <ChatBot />
      </AuthProvider>
    </ClerkProvider>
  );
}
