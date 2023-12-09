import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostType } from '../../models/post';
import { PostComponent } from '../post/post.component'
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, PostComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent {
  @Input() data: PostType[] | undefined;
  @Input() selectedCategory: string = ''; // Make it optional

  filterPostsByCategory(posts: PostType[], category: string): PostType[] {
    if (category) {
      return posts.filter(post => post.categories.includes(category));
    } else {
      return posts; // Return all posts if no category is selected
    }
  }
}
