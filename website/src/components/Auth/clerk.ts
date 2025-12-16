// Clerk configuration
// Get your publishable key from https://dashboard.clerk.com

export const clerkConfig = {
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
};

// Validate that the key is set
if (!clerkConfig.publishableKey) {
  console.warn(
    'Missing Clerk Publishable Key. Please add CLERK_PUBLISHABLE_KEY to your .env file.'
  );
}
