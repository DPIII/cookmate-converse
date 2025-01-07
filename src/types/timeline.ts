export interface TimelinePost {
  id: string;
  content: string;
  created_at: string;
  recipe: {
    id: string;
    title: string;
    content: string;
    image_url: string | null;
  };
  user: {
    username: string;
  };
}

export interface UserProfile {
  id: string;
  username: string | null;
}