import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {  FormsModule,NgForm, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,  FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  firstNameError: string = '';
  lastNameError: string = '';
  emailError: string = '';
  passwordError: string = '';

  constructor(private authService: AuthService, 
  private router: Router) {}

  handleLoginClick(): void {
    this.router.navigate(['/login']);
  }

  isEmailValid(input: string): boolean {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailPattern.test(input);
  }

  clearErrors(): void {
    this.firstNameError = '';
    this.lastNameError = '';
    this.emailError = '';
    this.passwordError = '';
  }

  async handleRegister(form: NgForm): Promise<void> {
    this.clearErrors();

    const namePattern = /^[A-Za-z]+$/;

    if (!this.firstName) {
      this.firstNameError = 'First name is required';
      return;
    } else if (!namePattern.test(this.firstName)) {
      this.firstNameError = 'First name should contain only alphabetic characters';
      return;
    }

    if (!this.lastName) {
      this.lastNameError = 'Last name is required';
      return;
    } else if (!namePattern.test(this.lastName)) {
      this.lastNameError = 'Last name should contain only alphabetic characters';
      return;
    }

    if (!this.isEmailValid(this.email)) {
      this.emailError = 'Invalid email address';
      return;
    }

    if (!this.password) {
      this.passwordError = 'Password is required';
      return;
    }

    if (this.firstNameError || this.lastNameError || this.emailError || this.passwordError) {
      return;
    }


    try {
      const response = await this.authService.register(this.firstName, this.lastName, this.email, this.password).toPromise();
  
      if (response && response.token) {
        // Registration successful, you can handle the token or any other logic here
        console.log('Registration successful. Token:', response.token);
        this.router.navigate(['/login']);
      } else {
        console.error('Registration failed. Invalid response:', response);
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
    }

    // try {

    //   await this.authService.register(this.firstName, this.lastName, this.email, this.password).toPromise();
    // // let user = {firstName:this.firstName,lastName: this.lastName, email:this.email,password: this.password};
    // // this.authService.users.push(user);

    //   console.log('Registration successful');
    //   this.router.navigate(['/login']);
    // } catch (error: any) {
    //   console.error('Registration failed:', error);
    //   console.log('Full Response:', error);
    //   console.log('Response Body:', error.error);
    // }
  }
}