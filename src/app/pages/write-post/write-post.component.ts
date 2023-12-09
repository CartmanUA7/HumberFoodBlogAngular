import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms'; 
import { PostsService } from '../../services/posts.service';
import { AuthService } from '../../services/auth.service'; 
import { UserType } from '../../models/user';

@Component({
  selector: 'app-write-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './write-post.component.html',
  styleUrl: './write-post.component.css',
})
export class WritePostComponent {
  constructor(
    private router: Router,
    private postsService: PostsService,
    private authService: AuthService
  ) {
    this.user = authService.getUser();
  }

  writeForm = new FormGroup({
    fileInput: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    categories: new FormControl('Other'),
    content: new FormControl('', [Validators.required]),
  });

  user: UserType | undefined;
  imageUrl =
    'https://images.pexels.com/photos/6685428/pexels-photo-6685428.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500';
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
    if (!this.writeForm.valid || !this.file || !this.user) return;

    let newPost = {
      _id: '',
      author: '',
      authorName: this.user.firstName + " " + this.user.lastName,
      image: this.writeForm.value.fileInput!,
      title: this.writeForm.value.title!,
      content: this.writeForm.value.content!,
      categories: this.writeForm.value.categories!,
      postTime: '',
      comments: [],
      likes: [],
    };

    this.postsService.addPost(newPost, this.file);
    this.postsService.postSubject.subscribe((e) =>
      this.router.navigate([`/post/${e.title}`])
    );
  }
}
