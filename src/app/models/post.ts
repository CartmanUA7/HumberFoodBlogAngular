import { CommentType } from './comment';

export interface PostType {
  _id: string;
  author: string;
  authorName: string | undefined;
  title: string;
  content: string;
  image: string;
  postTime: string;
  comments: CommentType[];
  categories: string;
  likes: string[];
}