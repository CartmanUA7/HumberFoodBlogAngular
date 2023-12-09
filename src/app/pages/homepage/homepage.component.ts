import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsService } from '../../services/posts.service'; 
import { HeaderComponent } from "../../components/header/header.component";
import { PostsComponent } from "../../components/posts/posts.component";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";

@Component({
  selector: 'app-homepage',
  standalone: true,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
  imports: [CommonModule, HeaderComponent, PostsComponent, SidebarComponent],
})
export class HomepageComponent {
  
  constructor(
    private postsService: PostsService,
  ) {}

  posts = this.postsService.getPosts();
  selectedCategory = '';

  onCategorySelected(category: string): void {
    this.selectedCategory = category;
  }
}
