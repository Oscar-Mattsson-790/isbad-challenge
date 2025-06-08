export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type BathRow = {
  id: string;
  created_at: string;
  user_id: string;
  date: string;
  time: string;
  duration: string;
  feeling: string;
  proof_url: string | null;
};

export type BathInsert = {
  id: string;
  created_at?: string;
  user_id: string;
  date: string;
  time: string;
  duration: string;
  feeling: string;
  proof_url?: string | null;
};

export type BathUpdate = Partial<BathInsert>;

export type FriendRow = {
  id: string;
  created_at: string;
  user_id: string;
  friend_id: string;
  status: string;
};

export type FriendInsert = {
  id: string;
  created_at?: string;
  user_id: string;
  friend_id: string;
  status: string;
};

export type FriendUpdate = Partial<FriendInsert>;

export type ProfileRow = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
};

export type ProfileInsert = {
  id: string;
  created_at?: string;
  full_name: string;
  email: string;
};

export type ProfileUpdate = Partial<ProfileInsert>;

export type Database = {
  public: {
    Tables: {
      baths: {
        Row: BathRow;
        Insert: BathInsert;
        Update: BathUpdate;
      };
      friends: {
        Row: FriendRow;
        Insert: FriendInsert;
        Update: FriendUpdate;
      };
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Views: {};
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Functions: {};
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Enums: {};
  };
};
