import React, { useEffect } from 'react';
import { useClerk } from '@clerk/clerk-react';
import Layout from '@theme/Layout';

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();

  useEffect(() => {
    async function handleCallback() {
      try {
        // Handle the OAuth redirect callback
        await handleRedirectCallback();
        // The redirect will happen automatically after successful authentication
      } catch (error) {
        console.error('Error handling OAuth callback:', error);
        // Redirect to home page on error
        window.location.href = '/';
      }
    }

    handleCallback();
  }, [handleRedirectCallback]);

  return (
    <Layout title="Authenticating..." description="Completing authentication...">
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h2>Completing authentication...</h2>
        <p>Please wait while we sign you in.</p>
        {/* Clerk captcha div required for sign-up flows */}
        <div id="clerk-captcha" />
      </div>
    </Layout>
  );
}
