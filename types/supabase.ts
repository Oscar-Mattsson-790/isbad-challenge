export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
  public: {
    Tables: {
      baths: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          date: string;
          time: string;
          duration: string;
          feeling: string;
          proof_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          date: string;
          time: string;
          duration: string;
          feeling: string;
          proof_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["baths"]["Insert"]>;
      };
      friends: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          friend_id: string;
          status: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          friend_id: string;
          status: string;
        };
        Update: Partial<Database["public"]["Tables"]["friends"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          full_name: string;
          email: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          full_name: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
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
