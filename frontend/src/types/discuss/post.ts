export type Post = {
  id: string;
  title: string;
  description: string;
  commentsCount: number;
  views: number;
  upvotes: number;
  createdAt: string;
  user: {
    username: string;
    fullName: string;
    avatar?: string;
  };
};