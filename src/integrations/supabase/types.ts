export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      billing_plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: string[] | null
          id: string
          interval: string
          is_active: boolean | null
          name: string
          price: number
          stripe_price_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          interval: string
          is_active?: boolean | null
          name: string
          price: number
          stripe_price_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          interval?: string
          is_active?: boolean | null
          name?: string
          price?: number
          stripe_price_id?: string | null
        }
        Relationships: []
      }
      billing_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      collection_recipes: {
        Row: {
          added_at: string | null
          collection_id: string
          recipe_id: string
        }
        Insert: {
          added_at?: string | null
          collection_id: string
          recipe_id: string
        }
        Update: {
          added_at?: string | null
          collection_id?: string
          recipe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_recipes_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "recipe_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "saved_recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_history: {
        Row: {
          changed_at: string | null
          id: string
          new_tier: Database["public"]["Enums"]["membership_tier"] | null
          previous_tier: Database["public"]["Enums"]["membership_tier"] | null
          reason: string | null
          user_id: string | null
        }
        Insert: {
          changed_at?: string | null
          id?: string
          new_tier?: Database["public"]["Enums"]["membership_tier"] | null
          previous_tier?: Database["public"]["Enums"]["membership_tier"] | null
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          changed_at?: string | null
          id?: string
          new_tier?: Database["public"]["Enums"]["membership_tier"] | null
          previous_tier?: Database["public"]["Enums"]["membership_tier"] | null
          reason?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          contact_info: string | null
          created_at: string
          dietary_preferences: string[] | null
          favorite_cuisines: string[] | null
          id: string
          membership_tier: Database["public"]["Enums"]["membership_tier"]
          membership_updated_at: string | null
          name: string | null
          phone_number: string | null
          phone_verified: boolean | null
          profile_picture_url: string | null
          skill_level: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          contact_info?: string | null
          created_at?: string
          dietary_preferences?: string[] | null
          favorite_cuisines?: string[] | null
          id: string
          membership_tier?: Database["public"]["Enums"]["membership_tier"]
          membership_updated_at?: string | null
          name?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          profile_picture_url?: string | null
          skill_level?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          contact_info?: string | null
          created_at?: string
          dietary_preferences?: string[] | null
          favorite_cuisines?: string[] | null
          id?: string
          membership_tier?: Database["public"]["Enums"]["membership_tier"]
          membership_updated_at?: string | null
          name?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          profile_picture_url?: string | null
          skill_level?: string | null
          username?: string | null
        }
        Relationships: []
      }
      recipe_collections: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      recipe_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          rating: number | null
          recipe_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          rating?: number | null
          recipe_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          rating?: number | null
          recipe_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_comments_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "saved_recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_likes: {
        Row: {
          created_at: string | null
          id: string
          recipe_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipe_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          recipe_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_likes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "saved_recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_recipes: {
        Row: {
          content: string
          cooking_time: unknown | null
          created_at: string
          cuisine_type: string | null
          id: string
          image_url: string | null
          ingredients: Json | null
          is_favorite: boolean | null
          meal_type: string | null
          notes: string | null
          rating: number | null
          share_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          content: string
          cooking_time?: unknown | null
          created_at?: string
          cuisine_type?: string | null
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          is_favorite?: boolean | null
          meal_type?: string | null
          notes?: string | null
          rating?: number | null
          share_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          content?: string
          cooking_time?: unknown | null
          created_at?: string
          cuisine_type?: string | null
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          is_favorite?: boolean | null
          meal_type?: string | null
          notes?: string | null
          rating?: number | null
          share_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      timeline_posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          recipe_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          recipe_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          recipe_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_posts_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "saved_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_connections: {
        Row: {
          connected_user_id: string
          created_at: string | null
          id: string
          status: string
          user_id: string
        }
        Insert: {
          connected_user_id: string
          created_at?: string | null
          id?: string
          status: string
          user_id: string
        }
        Update: {
          connected_user_id?: string
          created_at?: string | null
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_connections_connected_user_id_fkey"
            columns: ["connected_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      backfill_timeline_posts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      membership_tier: "free" | "paid" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
