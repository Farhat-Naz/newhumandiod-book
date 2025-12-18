// Clerk configuration
// Get your publishable key from https://dashboard.clerk.com

// In Docusaurus, we can access env variables via import.meta.env (Vite) or process.env (Node)
// For client-side access in Docusaurus, we need to use window or inject via config
// For now, we'll use a direct approach that works with both build and dev
const getClerkKey = (): string => {
  // Try to get from environment variable
  if (typeof process !== 'undefined' && process.env?.CLERK_PUBLISHABLE_KEY) {
    return process.env.CLERK_PUBLISHABLE_KEY;
  }

  // Fallback to the key from .env (will be bundled)
  // In production, make sure to set this as an environment variable
  return 'pk_test_d29ya2FibGUtZ2FyLTcxLmNsZXJrLmFjY291bnRzLmRldiQ';
};

export const clerkConfig = {
  publishableKey: getClerkKey(),
};

// Validate that the key is set
if (!clerkConfig.publishableKey || clerkConfig.publishableKey === 'YOUR_CLERK_PUBLISHABLE_KEY') {
  console.warn(
    'Missing or invalid Clerk Publishable Key. Please add CLERK_PUBLISHABLE_KEY to your .env file or configure it properly.'
  );
}
