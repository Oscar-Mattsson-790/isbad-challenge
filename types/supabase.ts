export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type LeaderboardRow = {
  full_name: string;
  bath_count: number;
  challenges_completed: number;
};

// 🔹 CHALLENGE LOGS
export type ChallengeLogRow = {
  id: string;
  user_id: string;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  challenge_length: number;
  profiles?: ProfileRow;
};

export type ChallengeLogInsert = {
  id?: string;
  user_id: string;
  created_at?: string;
  started_at?: string | null;
  completed_at?: string | null;
  challenge_length: number;
};

export type ChallengeLogUpdate = Partial<ChallengeLogInsert>;

// 🔹 BATHS
export type BathRow = {
  id: string;
  created_at: string;
  user_id: string;
  date: string;
  time: string;
  duration: string;
  feeling: string;
  proof_url: string | null;
  type: string | null;
  profiles?: ProfileRow;
};

export type BathInsert = {
  id?: string;
  created_at?: string;
  user_id: string;
  date: string;
  time: string;
  duration: string;
  feeling: string;
  proof_url?: string | null;
  type?: string | null;
};

export type BathUpdate = Partial<BathInsert>;

// 🔹 FRIENDS
export type FriendRow = {
  id: string;
  created_at: string;
  user_id: string;
  friend_id: string;
  status: string;
  profiles?: ProfileRow | null;
};

export type FriendInsert = {
  id?: string;
  created_at?: string;
  user_id: string;
  friend_id: string;
  status: string;
};

export type FriendUpdate = Partial<FriendInsert>;

// 🔹 PROFILES
export type ProfileRow = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  challenge_length?: number | null;
  challenge_started_at?: string | null;
  challenge_active?: boolean | null;
  avatar_url?: string | null;
};

export type ProfileInsert = {
  id: string;
  created_at?: string;
  full_name: string;
  email: string;
  challenge_length?: number | null;
  challenge_started_at?: string | null;
  challenge_active?: boolean | null;
  avatar_url?: string | null;
};

export type ProfileUpdate = Partial<ProfileInsert>;

// 🔹 DATABASE DEFINITION
export type Database = {
  public: {
    Tables: {
      baths: {
        Row: BathRow;
        Insert: BathInsert;
        Update: BathUpdate;
        Relationships: [
          {
            foreignKeyName: "baths_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      friends: {
        Row: FriendRow;
        Insert: FriendInsert;
        Update: FriendUpdate;
        Relationships: [
          {
            foreignKeyName: "friends_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "friends_friend_id_fkey";
            columns: ["friend_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      challenge_logs: {
        Row: ChallengeLogRow;
        Insert: ChallengeLogInsert;
        Update: ChallengeLogUpdate;
        Relationships: [
          {
            foreignKeyName: "challenge_logs_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Views: {};
    Functions: {
      get_leaderboard: {
        Args: Record<string, never>; // eller dina inputs om funktionen tar några
        Returns: LeaderboardRow[]; // om du har en typ för resultatet
      };
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Enums: {};
  };
};
