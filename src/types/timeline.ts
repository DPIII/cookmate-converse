export interface TimelinePost {
  id: string;
  content: string;
  created_at: string;
  recipe: {
    id: string;
    title: string;
    content: string;
    image_url: string | null;
    cuisine_type?: string;
    rating?: number;
    notes?: string;
    share_id?: string;
    shopping_list?: string | null;
  };
  user: {
    username: string;
  };
}

export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
}