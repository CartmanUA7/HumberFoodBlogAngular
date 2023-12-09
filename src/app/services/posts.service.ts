import { Injectable } from '@angular/core';
import { CommentType } from '../models/comment';
import { PostType } from '../models/post';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { config } from '../../../config';
import { Observable, Subject, Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { UserType } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private posts: PostType[] = [];
  postSubject = new Subject<PostType>();

  getPosts(): PostType[] {
    if (this.posts.length == 0) {
      this.http
        .get<PostType[]>(`${config.SERVER_URL}/api/posts/getPosts`)
        .subscribe((e) => {
          this.posts = e;
          return this.posts;
        });
    }
    return this.posts;
  }

  addPost(post: PostType, file: File): void {
    const token = localStorage.getItem('token');
    const user: UserType | undefined = this.authService.getUser();
    if (!token || !user) return;

    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('content', post.content);
    formData.append('categories', post.categories);
    formData.append('productImage', file, file.name);

    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token', token);

    this.http
      .post<PostType>(`${config.SERVER_URL}/api/posts/newPost`, formData, {
        headers,
      })
      .subscribe({
        next: (e) => {
          e.authorName = post.authorName;
          this.posts.push(e);
          this.postSubject.next(e);
        },
        error: (e) => {
          console.log(e);
        },
      });
  }

  editPost(post: PostType, file: File | undefined): void {
    const token = localStorage.getItem('token');
    const user: UserType | undefined = this.authService.getUser();
    if (!token || !user) return;

    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('content', post.content);
    formData.append('categories', post.categories);
    if (file) {
      formData.append('productImage', file, file.name);
    }

    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token', token);

    this.http
      .post<PostType>(
        `${config.SERVER_URL}/api/posts/editPost/${post._id}`,
        formData,
        {
          headers,
        }
      )
      .subscribe({
        next: (e) => {
          e.authorName = post.authorName;
          const i = this.posts.findIndex((p) => p._id === post._id);
          if (i >= 0) {
            this.posts[i] = e;
          }
          this.postSubject.next(e);
        },
        error: (e) => {
          console.log(e);
        },
      });
  }

  deletePost(postID: string): void {
    const token = localStorage.getItem('token');
    const user: UserType | undefined = this.authService.getUser();
    if (!token || !user) return;

    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token', token);

    this.http
      .post<PostType>(
        `${config.SERVER_URL}/api/posts/deletePost/${postID}`,
        {},
        {
          headers,
        }
      )
      .subscribe({
        next: (e) => {
          this.posts = this.posts.filter((e) => e._id !== postID);
        },
        error: (e) => {
          console.log(e);
        },
      });

    this.posts = this.posts.filter((e) => e._id !== postID);
  }

  likePost(postID: string, userID: string): void {
    const token = localStorage.getItem('token');
    const user: UserType | undefined = this.authService.getUser();
    if (!token || !user) return;

    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token', token);

    this.http
      .post(
        `${config.SERVER_URL}/api/posts/likePost/${postID}`,
        {},
        {
          headers,
          responseType: 'text',
        }
      )
      .subscribe({
        next: (e) => {
          const post = this.posts.find((e) => e._id === postID);
          if (post && !post.likes.includes(userID)) {
            post.likes.push(userID);
          }
        },
        error: (e) => {
          console.log(e);
        },
      });
  }

  addComment(postID: string, content: string): void {
    const token = localStorage.getItem('token');
    const user: UserType | undefined = this.authService.getUser();
    if (!token || !user) return;

    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token', token);

    this.http
      .post<CommentType>(
        `${config.SERVER_URL}/api/posts/newComment/${postID}`,
        { content },
        { headers }
      )
      .subscribe({
        next: (e) => {
          e.authorName = user.firstName + " " + user.lastName;
          this.posts.find((e) => e._id === postID)?.comments.push(e);
        },
        error: (e) => {
          console.log(e);
        },
      });
  }

  editComment(postID: string, comment: CommentType): void {
    const token = localStorage.getItem('token');
    const user: UserType | undefined = this.authService.getUser();
    if (!token || !user) return;

    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token', token);

    this.http
      .post(
        `${config.SERVER_URL}/api/posts/editComment/${postID}/${comment._id}`,
        { content: comment.content },
        { headers, responseType: 'text' }
      )
      .subscribe({
        next: (e) => {
          let newComment = this.posts
            .find((e) => e._id === postID)
            ?.comments.find((e) => e._id === comment._id);

          if (newComment) {
            newComment.content = comment.content;
          }
        },
        error: (e) => {
          console.log(e);
        },
      });
  }

  deleteComment(postID: string, id: string): void {
    const token = localStorage.getItem('token');
    const user: UserType | undefined = this.authService.getUser();
    if (!token || !user) return;

    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token', token);

    this.http
      .post(
        `${config.SERVER_URL}/api/posts/deleteComment/${postID}/${id}`,
        {},
        { headers, responseType: 'text' }
      )
      .subscribe({
        next: (e) => {
          const post = this.posts.find((e) => e._id === postID);
          if (post?.comments) {
            post.comments = post.comments.filter((e) => e._id !== id);
          }
        },
        error: (e) => {
          console.log(e);
        },
      });
  }

  likeComment(postID: string, id: string, userID: string): void {
    const token = localStorage.getItem('token');
    const user: UserType | undefined = this.authService.getUser();
    if (!token || !user) return;
    
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token', token);

    this.http
      .post(
        `${config.SERVER_URL}/api/posts/likeComment/${postID}/${id}`,
        {},
        {
          headers,
          responseType: 'text',
        }
      )
      .subscribe({
        next: (e) => {
          const post = this.posts.find((e) => e._id === postID);
          const comment = post?.comments.find((e) => e._id === id);
          if (post && comment && !comment.likes.includes(userID)) {
            comment.likes.push(userID);
          }
        },
        error: (e) => {
          console.log(e);
        },
      });
  }
}
