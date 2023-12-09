import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { AboutComponent } from './pages/about/about.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { SinglePostComponent } from './pages/single-post/single-post.component';
import { WritePostComponent } from './pages/write-post/write-post.component';
import { EditPostComponent } from './pages/edit-post/edit-post.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'about', component: AboutComponent },
  { path: 'posts', component: HomepageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'post/:id', component: SinglePostComponent },
  { path: 'write', component: WritePostComponent },
  { path: 'edit/:id', component: EditPostComponent },
  { path: 'userProfile', component: UserProfileComponent },
  { path: '**', redirectTo: '/' },
];