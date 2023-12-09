import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';
  loginError: string = '';

  ngOnInit(): void {  }

  constructor(private authService: AuthService, private router: Router) {}

  handleRegisterClick(): void {
    this.router.navigate(['/register']);
  }

  isEmailValid(input: string): boolean {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailPattern.test(input);
  }

  clearErrors(): void {
    this.emailError = '';
    this.passwordError = '';
    this.loginError = '';
  }

  handleLogin(form: NgForm): void {
    this.clearErrors();

    if (!this.isEmailValid(this.email)) {
      this.emailError = 'Invalid email address';
      return;
    }

    if (!this.email) {
      this.emailError = 'Please enter email';
      return;
    }

    if (!this.password) {
      this.passwordError = 'Password is required';
      return;
    }
    // Call the login method from AuthService
  this.authService.login(this.email, this.password)
  .subscribe(
    (response: any) => {
      // Login successful, handle user and navigate
      this.router.navigate(['/']);
      console.log('User logging in successful');
    },
    (error: any) => {
      // Handle login error
      if (error.status === 400) {
        this.loginError = 'User is not registered. Please register.';
      } else {
        this.loginError = 'Login failed. Please check your credentials.';
        console.error('Login failed:', error);
      }
    }
  );


    //*****Hard Coding Login Method Using Users Array in AuthServis******************** */
    // let user = {email:this.email, password:this.password}
    // console.log(user);
    // this.authService.login(user)

    //   .subscribe(
    //     (user: any) => {
    //       // Login successful, handle user and navigate
    //       localStorage.setItem('token', user.token);
    //       this.router.navigate(['/']);
    //       console.log('User loginning successful');
    //     },
    //     (error: any) => {
    //       // Handle login error
    //       if (error.status === 400) {
    //         this.loginError = 'User is not registered. Please register.';
    //       } else {
    //         this.loginError = 'Login failed. Please check your credentials.';
    //         console.error('Login failed:', error);
    //       }
    //     }
    //   );
    //**************************************************************** */
  }
}
