export type Post = {
  id: string;
  title: string;
  description: string;
  commentsCount: number;
  views: number;
  upvotes: number;
  createdAt: string;
  tags: string[];
  user: {
    id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
  DiscussionUpvote: {
    userId: string;
  }[];
};

export type PostComment = {
  id: string;
  title: string;
  description: string;
  commentsCount: number;
  views: number;
  upvotes: number;
  createdAt: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
  comments: {
    comment: string;
    upvote: number;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      username: string;
      fullName: string;
      avatar: string;
    };
  }[];
   DiscussionUpvote: {
    userId: string;
  }[];
};

export type Comment = {
  id: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  upvote: number;
  discuss: {
    id: string;
    title: string;
  };
  user: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  CommentUpvote:{
    userId:string;
  }[]
};
