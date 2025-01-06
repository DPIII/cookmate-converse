import { Json } from './base';

export interface CollectionRecipesTable {
  Row: {
    added_at: string | null;
    collection_id: string;
    recipe_id: string;
  };
  Insert: {
    added_at?: string | null;
    collection_id: string;
    recipe_id: string;
  };
  Update: {
    added_at?: string | null;
    collection_id?: string;
    recipe_id?: string;
  };
  Relationships: [
    {
      foreignKeyName: "collection_recipes_collection_id_fkey";
      columns: ["collection_id"];
      isOneToOne: false;
      referencedRelation: "recipe_collections";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "collection_recipes_recipe_id_fkey";
      columns: ["recipe_id"];
      isOneToOne: false;
      referencedRelation: "saved_recipes";
      referencedColumns: ["id"];
    }
  ];
}

export interface ProfilesTable {
  Row: {
    avatar_url: string | null;
    created_at: string;
    dietary_preferences: string[] | null;
    favorite_cuisines: string[] | null;
    id: string;
    profile_picture_url: string | null;
    skill_level: string | null;
    username: string | null;
  };
  Insert: {
    avatar_url?: string | null;
    created_at?: string;
    dietary_preferences?: string[] | null;
    favorite_cuisines?: string[] | null;
    id: string;
    profile_picture_url?: string | null;
    skill_level?: string | null;
    username?: string | null;
  };
  Update: {
    avatar_url?: string | null;
    created_at?: string;
    dietary_preferences?: string[] | null;
    favorite_cuisines?: string[] | null;
    id?: string;
    profile_picture_url?: string | null;
    skill_level?: string | null;
    username?: string | null;
  };
  Relationships: [];
}

export interface RecipeCollectionsTable {
  Row: {
    created_at: string | null;
    description: string | null;
    id: string;
    is_public: boolean | null;
    name: string;
    user_id: string | null;
  };
  Insert: {
    created_at?: string | null;
    description?: string | null;
    id?: string;
    is_public?: boolean | null;
    name: string;
    user_id?: string | null;
  };
  Update: {
    created_at?: string | null;
    description?: string | null;
    id?: string;
    is_public?: boolean | null;
    name?: string;
    user_id?: string | null;
  };
  Relationships: [];
}

export interface RecipeCommentsTable {
  Row: {
    content: string;
    created_at: string | null;
    id: string;
    rating: number | null;
    recipe_id: string | null;
    user_id: string | null;
  };
  Insert: {
    content: string;
    created_at?: string | null;
    id?: string;
    rating?: number | null;
    recipe_id?: string | null;
    user_id?: string | null;
  };
  Update: {
    content?: string;
    created_at?: string | null;
    id?: string;
    rating?: number | null;
    recipe_id?: string | null;
    user_id?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "recipe_comments_recipe_id_fkey";
      columns: ["recipe_id"];
      isOneToOne: false;
      referencedRelation: "saved_recipes";
      referencedColumns: ["id"];
    }
  ];
}

export interface RecipeLikesTable {
  Row: {
    created_at: string | null;
    id: string;
    recipe_id: string | null;
    user_id: string | null;
  };
  Insert: {
    created_at?: string | null;
    id?: string;
    recipe_id?: string | null;
    user_id?: string | null;
  };
  Update: {
    created_at?: string | null;
    id?: string;
    recipe_id?: string | null;
    user_id?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "recipe_likes_recipe_id_fkey";
      columns: ["recipe_id"];
      isOneToOne: false;
      referencedRelation: "saved_recipes";
      referencedColumns: ["id"];
    }
  ];
}

export interface SavedRecipesTable {
  Row: {
    content: string;
    cooking_time: unknown | null;
    created_at: string;
    cuisine_type: string | null;
    id: string;
    image_url: string | null;
    ingredients: Json | null;
    is_favorite: boolean | null;
    meal_type: string | null;
    notes: string | null;
    title: string;
    user_id: string;
  };
  Insert: {
    content: string;
    cooking_time?: unknown | null;
    created_at?: string;
    cuisine_type?: string | null;
    id?: string;
    image_url?: string | null;
    ingredients?: Json | null;
    is_favorite?: boolean | null;
    meal_type?: string | null;
    notes?: string | null;
    title: string;
    user_id: string;
  };
  Update: {
    content?: string;
    cooking_time?: unknown | null;
    created_at?: string;
    cuisine_type?: string | null;
    id?: string;
    image_url?: string | null;
    ingredients?: Json | null;
    is_favorite?: boolean | null;
    meal_type?: string | null;
    notes?: string | null;
    title?: string;
    user_id?: string;
  };
  Relationships: [];
}

export interface TimelinePostsTable {
  Row: {
    id: string;
    user_id: string | null;
    recipe_id: string | null;
    content: string;
    created_at: string | null;
  };
  Insert: {
    id?: string;
    user_id?: string | null;
    recipe_id?: string | null;
    content: string;
    created_at?: string | null;
  };
  Update: {
    id?: string;
    user_id?: string | null;
    recipe_id?: string | null;
    content?: string;
    created_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "timeline_posts_recipe_id_fkey";
      columns: ["recipe_id"];
      isOneToOne: false;
      referencedRelation: "saved_recipes";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "timeline_posts_user_id_fkey";
      columns: ["user_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    }
  ];
}

export interface UserConnectionsTable {
  Row: {
    id: string;
    user_id: string;
    connected_user_id: string;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    connected_user_id: string;
    status: 'pending' | 'accepted' | 'rejected';
    created_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    connected_user_id?: string;
    status?: 'pending' | 'accepted' | 'rejected';
    created_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "user_connections_user_id_fkey";
      columns: ["user_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "user_connections_connected_user_id_fkey";
      columns: ["connected_user_id"];
      isOneToOne: false;
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    }
  ];
}