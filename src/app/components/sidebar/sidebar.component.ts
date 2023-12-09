import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostType } from '../../models/post';
import { PostComponent } from '../post/post.component';
import { PostsComponent } from '../posts/posts.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, PostsComponent, PostComponent, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  @Input() posts: PostType[] = [];
  @Input() selectedCategory: string = '';
  @Output() selectedCategoryChange = new EventEmitter<string>();

  categories: string[] = [];

  ngOnInit(): void {
    this.categories = [...new Set(this.posts.map((post) => post.categories))];
  }

  handleCategoryClick(category: string): void {
    this.selectedCategoryChange.emit(category);
  }
}
