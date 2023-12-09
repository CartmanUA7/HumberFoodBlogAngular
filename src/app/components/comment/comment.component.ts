import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentType } from '../../models/comment';
import { PostsService } from '../../services/posts.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteCommentComponent } from '../delete-comment/delete-comment.component';
import { EditCommentComponent } from '../edit-comment/edit-comment.component';
import { AuthService } from '../../services/auth.service';
import { UserType } from '../../models/user';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent {
  @Input() postID!: string;
  @Input() comment!: CommentType;

  constructor(
    public dialog: MatDialog,
    private postsService: PostsService,
    private authService: AuthService
  ) {
    this.user = authService.getUser();
  }

  user: UserType | undefined;
  editing = false;
  deleting = false;
  liked = 'fa-regular';

  ngOnInit() {
    if (this.comment.likes.find((e) => e == this.user?._id)) {
      this.liked = 'fa-solid';
    } else {
      this.liked = 'fa-regular';
    }
  }

  handleLike() {
    if (this.postID && this.user && this.liked == 'fa-regular') {
      this.postsService.likeComment(
        this.postID,
        this.comment._id,
        this.user._id
      );
      this.liked = 'fa-solid';
    }
  }

  openEditDialog(): void {
    this.dialog
      .open(EditCommentComponent, {
        width: '2000px',
        enterAnimationDuration: '500ms',
        exitAnimationDuration: '500ms',
        data: {
          content: this.comment.content,
        },
      })
      .afterClosed()
      .subscribe((content) => {
        if (
          content &&
          this.comment &&
          this.user &&
          this.comment.author == this.user._id
        ) {
          let newComment = { ...this.comment };
          newComment.content = content;
          this.postsService.editComment(this.postID, newComment);
        }
      });
  }

  openDeleteDialog(): void {
    this.dialog
      .open(DeleteCommentComponent, {
        width: '1000px',
        enterAnimationDuration: '500ms',
        exitAnimationDuration: '500ms',
      })
      .afterClosed()
      .subscribe((e) => {
        if (
          e == 'OK' &&
          this.comment &&
          this.user &&
          this.comment.author == this.user._id
        ) {
          this.postsService.deleteComment(this.postID, this.comment._id);
        }
      });
  }
}
