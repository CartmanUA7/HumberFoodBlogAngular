import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostType } from '../../models/post';
import { config } from '../../../../config';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent {
  @Input() post!: PostType;

  parsedDate = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.parsedDate = new Date(this.post.postTime).toLocaleString();
  }

  navigateToPost(): void {
    this.router.navigate(['/post', this.post.title]);
  }
}
