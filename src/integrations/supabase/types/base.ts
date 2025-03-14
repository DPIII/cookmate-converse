import { Json } from './helpers';
import {
  CollectionRecipesTable,
  ProfilesTable,
  RecipeCollectionsTable,
  RecipeCommentsTable,
  RecipeLikesTable,
  SavedRecipesTable,
  TimelinePostsTable,
  UserConnectionsTable
} from './tables';

export interface Database {
  public: {
    Tables: {
      collection_recipes: CollectionRecipesTable;
      profiles: ProfilesTable;
      recipe_collections: RecipeCollectionsTable;
      recipe_comments: RecipeCommentsTable;
      recipe_likes: RecipeLikesTable;
      saved_recipes: SavedRecipesTable;
      timeline_posts: TimelinePostsTable;
      user_connections: UserConnectionsTable;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}