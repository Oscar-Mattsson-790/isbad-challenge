/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Mock types to match Supabase's types
type User = {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
  };
};

type Session = {
  user: User;
  expires_at: number;
};

// Mock Supabase client with minimal functionality
type MockSupabaseClient = {
  auth: {
    getSession: () => Promise<{ data: { session: Session | null } }>;
    signInWithPassword: (credentials: {
      email: string;
      password: string;
    }) => Promise<{ data: any; error: any }>;
    signInWithOAuth: (params: {
      provider: string;
      options?: any;
    }) => Promise<{ data: any; error: any }>;
    signUp: (credentials: {
      email: string;
      password: string;
      options?: any;
    }) => Promise<{ data: any; error: any }>;
    signOut: () => Promise<{ error: any }>;
    onAuthStateChange: (
      callback: (event: string, session: Session | null) => void
    ) => {
      data: { subscription: { unsubscribe: () => void } };
    };
  };
  from: (table: string) => {
    select: (query: string) => {
      eq: (
        field: string,
        value: any
      ) => {
        single: () => Promise<{ data: any; error: any }>;
      };
      limit: (limit: number) => {
        order: (field: string) => Promise<{ data: any; error: any }>;
      };
    };
    insert: (data: any[]) => Promise<{ error: any }>;
  };
};

type SupabaseContext = {
  supabase: MockSupabaseClient;
  session: Session | null;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

// Mock user data
const mockUser: User = {
  id: "mock-user-id",
  email: "user@example.com",
  user_metadata: {
    full_name: "Demo User",
  },
};

// Mock session
const mockSession: Session = {
  user: mockUser,
  expires_at: Date.now() + 3600000, // 1 hour from now
};

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  // Create a mock Supabase client
  const mockSupabaseClient: MockSupabaseClient = {
    auth: {
      getSession: async () => {
        return { data: { session } };
      },
      signInWithPassword: async ({ email, password }) => {
        // Simulate successful login
        setSession(mockSession);
        return { data: { user: mockUser, session: mockSession }, error: null };
      },
      signInWithOAuth: async ({ provider, options }) => {
        // Simulate OAuth redirect
        return { data: { provider, options }, error: null };
      },
      signUp: async ({ email, password, options }) => {
        // Simulate successful signup
        return { data: { user: mockUser }, error: null };
      },
      signOut: async () => {
        // Simulate successful logout
        setSession(null);
        return { error: null };
      },
      onAuthStateChange: (callback) => {
        // Return a mock subscription
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        };
      },
    },
    from: (table) => {
      return {
        select: (query) => {
          return {
            eq: (field, value) => {
              return {
                single: async () => {
                  // Return mock profile data
                  if (
                    table === "profiles" &&
                    field === "id" &&
                    value === mockUser.id
                  ) {
                    return {
                      data: {
                        id: mockUser.id,
                        full_name: "Demo User",
                        email: mockUser.email,
                      },
                      error: null,
                    };
                  }
                  return { data: null, error: null };
                },
              };
            },
            limit: (limit) => {
              return {
                order: async (field) => {
                  // Return mock data for different tables
                  if (table === "colors") {
                    return {
                      data: [
                        { name: "Blue" },
                        { name: "Red" },
                        { name: "Green" },
                      ],
                      error: null,
                    };
                  }
                  return { data: [], error: null };
                },
              };
            },
          };
        },
        insert: async (data) => {
          // Simulate successful insert
          return { error: null };
        },
      };
    },
  };

  useEffect(() => {
    // Auto-login for demo purposes
    setSession(mockSession);
  }, []);

  return (
    <Context.Provider value={{ supabase: mockSupabaseClient, session }}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  }
  return context;
};
