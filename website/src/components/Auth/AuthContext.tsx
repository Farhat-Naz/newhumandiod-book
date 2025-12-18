import React, { createContext, useContext } from 'react';
import { useSignIn, useSignUp, useUser, useClerk } from '@clerk/clerk-react';

interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
}

interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<any>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signIn, setActive } = useSignIn();
  const { signUp, setActive: setSignUpActive } = useSignUp();
  const clerk = useClerk();

  // Convert Clerk user to our User interface
  const currentUser: User | null = user
    ? {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || null,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      }
    : null;

  async function signup(email: string, password: string) {
    if (!signUp || !setSignUpActive) {
      throw new Error('Clerk SignUp not loaded');
    }

    try {
      // Create the user with email and password
      const result = await signUp.create({
        emailAddress: email,
        password,
      });

      // Send email verification
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // For now, we'll set the session active without verification
      // In production, you'd want to handle email verification
      if (result.createdSessionId) {
        await setSignUpActive({ session: result.createdSessionId });
      }

      return result;
    } catch (error: any) {
      throw new Error(error.errors?.[0]?.message || 'Signup failed');
    }
  }

  async function login(email: string, password: string) {
    if (!signIn || !setActive) {
      throw new Error('Clerk SignIn not loaded');
    }

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        return result;
      } else {
        throw new Error('Login incomplete');
      }
    } catch (error: any) {
      throw new Error(error.errors?.[0]?.message || 'Login failed');
    }
  }

  async function logout() {
    await clerk.signOut();
  }

  async function loginWithGoogle() {
    if (!signIn || !setActive) {
      throw new Error('Clerk SignIn not loaded');
    }

    // Check if we're on the client side (Docusaurus uses SSR)
    if (typeof window === 'undefined') {
      throw new Error('Google login is only available on the client side');
    }

    try {
      // Initiate OAuth flow with Google
      const result = await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: window.location.origin + '/sso-callback',
        redirectUrlComplete: window.location.origin + '/',
      });
      return result;
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      throw new Error(error.errors?.[0]?.message || error.message || 'Google login failed');
    }
  }

  const value = {
    currentUser: isSignedIn ? currentUser : null,
    signup,
    login,
    logout,
    loginWithGoogle,
    loading: !isLoaded,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoaded && children}
    </AuthContext.Provider>
  );
}
