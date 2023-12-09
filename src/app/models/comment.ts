export interface CommentType {
  _id: string;
  content: string;
  author: string;
  authorName: string | undefined;
  postTime: string;
  likes: string[];
}