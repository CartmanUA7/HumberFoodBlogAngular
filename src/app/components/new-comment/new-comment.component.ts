import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { AuthService } from '../../services/auth.service';
import { UserType } from '../../models/user';

@Component({
  selector: 'app-new-comment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-comment.component.html',
  styleUrl: './new-comment.component.css',
})
export class NewCommentComponent {
  @Input() postId = '';

  newCommentForm = new FormGroup({
    content: new FormControl('', [Validators.required]),
  });

  constructor(
    private postsService: PostsService,
    private authService: AuthService
  ) {
    this.user = authService.getUser();
  }

  user: UserType | undefined;

  onSubmit(): void {
    if (!this.newCommentForm.valid || !this.user) return;

    this.postsService.addComment(
      this.postId,
      this.newCommentForm.value.content!
    );
    this.newCommentForm.reset();
  }
}
