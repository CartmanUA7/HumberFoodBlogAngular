import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommentComponent } from '../../components/comment/comment.component';
import { PostType } from '../../models/post';
import { NewCommentComponent } from '../../components/new-comment/new-comment.component';
import { config } from '../../../../config';
import { PostsService } from '../../services/posts.service';
import { DeletePostComponent } from '../../components/delete-post/delete-post.component';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { AuthService } from '../../services/auth.service';
import { UserType } from '../../models/user';

@Component({
  selector: 'app-single-post',
  standalone: true,
  imports: [
    CommonModule,
    EditPostComponent,
    CommentComponent,
    NewCommentComponent,
  ],
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.css',
})
export class SinglePostComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private postsService: PostsService,
    private authService: AuthService
  ) {
    this.route.url.subscribe((urlSegments) => {
      this.title = urlSegments[1].toString();
      this.post = postsService.getPosts().find((e) => e.title == this.title);
      if (!this.post) {
        this.router.navigate(['/']);
        return;
      }
    });
  }

  user: UserType | undefined;
  post: PostType | undefined;
  title = '';
  parsedDate = new Date().toLocaleString();
  liked = 'fa-regular';

  ngOnInit() {
    if (!this.post) return;
    this.parsedDate = new Date(this.post.postTime).toLocaleString();
    this.user = this.authService.getUser();
    if (this.post.likes.find((e) => e == this.user?._id)) {
      this.liked = 'fa-solid';
    } else {
      this.liked = 'fa-regular';
    }
  }

  handleLike() {
    if (this.post && this.user && this.liked == 'fa-regular') {
      this.postsService.likePost(this.post._id, this.user._id);
      this.liked = 'fa-solid';
    }
  }

  navigateToEdit() {
    this.router.navigate(['/edit', this.post?.title]);
  }

  openDeleteDialog(): void {
    this.dialog
      .open(DeletePostComponent, {
        width: '1000px',
        enterAnimationDuration: '500ms',
        exitAnimationDuration: '500ms',
      })
      .afterClosed()
      .subscribe((e) => {
        if (e == 'OK' && this.post && this.post.author == this.user?._id) {
          this.postsService.deletePost(this.post._id);
          this.router.navigate(['/']);
        }
      });
  }
}