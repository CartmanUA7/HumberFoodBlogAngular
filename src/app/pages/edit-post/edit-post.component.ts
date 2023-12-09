import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { config } from '../../../../config';
import { PostType } from '../../models/post';
import { AuthService } from '../../services/auth.service';
import { UserType } from '../../models/user';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-post.component.html',
  styleUrl: '../write-post/write-post.component.css',
})
export class EditPostComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postsService: PostsService,
    private authService: AuthService
  ) {
    this.user = authService.getUser();

    this.route.url.subscribe((urlSegments) => {
      let title = urlSegments[1].toString();
      this.post = postsService.getPosts().find((e) => e.title == title);
      if (!this.post || !this.user) {
        this.router.navigate(['/']);
        return;
      }
    });

    this.imageUrl = this.post!.image;
    this.writeForm = new FormGroup({
      fileInput: new FormControl(''),
      title: new FormControl(this.post?.title, [Validators.required]),
      categories: new FormControl(this.post?.categories),
      content: new FormControl(this.post?.content, [Validators.required]),
    });
  }

  post: PostType | undefined;
  user: UserType | undefined;
  imageUrl = '';
  writeForm: FormGroup;
  file: File | undefined;

  onSelect(event: Event) {
    this.file = (event.target as HTMLInputElement).files![0];
    this.writeForm.patchValue({ fileInput: this.file.name.split('\\').pop() });
    this.writeForm.get('fileInput')!.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result!.toString();
    };
    reader.readAsDataURL(this.file);
  }

  onSubmit() {
    if (!this.post || !this.writeForm.valid || !this.user || this.user._id != this.post.author) return;

    let newPost = { ...this.post };
    newPost.image = this.writeForm.value.fileInput!;
    newPost.title = this.writeForm.value.title!;
    newPost.content = this.writeForm.value.content!;
    newPost.categories = this.writeForm.value.categories!;

    this.postsService.editPost(newPost, this.file);
    this.postsService.postSubject.subscribe((e) =>
      this.router.navigate([`/post/${e.title}`])
    );
  }
}
