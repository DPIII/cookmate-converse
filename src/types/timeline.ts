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
  };
  user: {
    username: string;
  };
}