import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
//import { AuthService } from '../../context/AuthContext'; 
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  userData: any = {
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  constructor(
    //private authService: AuthService, // Adjust the path based on your service
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData(): void {
    // Get the token from local storage
    const token = localStorage.getItem('token');

    if (token) {
      this.http
        .post('http://localhost:3000/api/users/verifyToken', {}, {
          headers: {
            'x-auth-token': token
          }
        })
        .pipe(
          catchError((error) => {
            console.error('Error fetching user data:', error);
            return [];
          })
        )
        .subscribe((data: any) => {
          console.log(data);
          this.userData = data;
        });
    }
  }

  handleInputChange(event: any): void {
    const { name, value } = event.target;
    this.userData = { ...this.userData, [name]: value };
  }

  handleSubmit(): void {
    const token = localStorage.getItem('token');
    console.log('Request Payload:', this.userData);
    if (token) {
      this.http
        .put('http://localhost:3000/api/users/update', this.userData, {
          headers: {
            'x-auth-token': token,
          //  'Content-Type': 'application/json'
          }
        })
        .pipe(
          catchError((error) => {
            console.error('Error updating user data:', error);
            return [];
          })
        )
        .subscribe((updatedData: any) => {
          console.log(updatedData);
          this.router.navigate(['/']);
        });
    }
  }

  handleDeleteUser(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.http
        .delete(`http://localhost:3000/api/users/delete/${this.userData.email}`, {
          headers: {
            'x-auth-token': token
          }
        })
        .pipe(
          catchError((error) => {
            console.error('Error deleting user:', error);
            return [];
          })
        )
        .subscribe(() => {
          console.log('User deleted successfully');
          localStorage.removeItem('token');
          this.userData = {
            _id: '',
            firstName: '',
            lastName: '',
            email: '',
            password: ''
          };
          this.router.navigate(['/']);
        });
    }
  }

}
