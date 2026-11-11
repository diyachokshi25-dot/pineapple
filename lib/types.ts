// Types shared between the backend responses and the frontend displays.
// The frontend only ever holds what the API hands it — it adds nothing.
export type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
};

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  averageRating: number | null;
  totalReviews: number;
};

export type RestaurantDetail = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  ratingCounts: Record<string, number>;
  starsFilter: number | null;
  latestReview: Review | null;
  reviews: Review[];
  menuItems: MenuItem[];
};

export type RestaurantSummary = {
  id: number;
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
};
