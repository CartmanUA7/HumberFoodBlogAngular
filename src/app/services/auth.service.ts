import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { config } from '../../../config';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  private user: any = null;

  constructor(private http: HttpClient, private localStorageService:LocalStorageService) {}
  ngOnInit(): void {
    this.verifyToken();
  }

  
  private verifyToken(): void {
   //const token = localStorage.getItem('token');
   const token = this.localStorageService.getItem('token');

    if (token) {
      const header = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      };

      this.http
        .post(`${config.SERVER_URL}/api/users/verifyToken`, {}, header)
        .pipe(
          map((response: any) => {
            if (response.status === 200) {
              this.user = {
                _id: response.data.id,
                email: response.data.email,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
              };
            }
          })
        )
        .subscribe();
    }
  }
 
  
  public getUser(): any {
    return this.user;
    
  }
  
  public login(email: string, password: string): Observable<any> {
    const body = {
      email,
      password,
    };
  
    return this.http.post(`${config.SERVER_URL}/api/users/login`, body)
      .pipe(
        map((response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.user = {
              _id: response.id,
              email: response.email,
              firstName: response.firstName,
              lastName: response.lastName,
            };
          }
          return response;
        })
      );
  }

  public isLoggedIn(): boolean {
    return this.user;
  }
//*****Hard Coding Login Method Using Users Array Above******************** */

  // public login(user: any): Observable<any> {
  //   return new Observable((observer) => {
  //     const existedUser = this.users.find(u => u.email === user.email && u.password === user.password);
  //     if (existedUser) {
  //       const token = 'loginsuccess';
  //       localStorage.setItem('token', token);

  //       this.user = {
  //         email: existedUser.email,
  //         firstName: existedUser.firstName,
  //         lastName: existedUser.lastName,
  //       };

  //       observer.next(this.user);
  //       observer.complete();
  //     } else {
  //       observer.error('Invalid credentials');
  //       observer.complete();
  //     }
  //   });
  // }
  //******************************************** */

  public logout(): void {
    localStorage.removeItem('token');
    this.user = null;
  }

  public updateUserContext(updatedUser: any): void {
    this.user = updatedUser;
  }

  public register(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    const body = {
      firstName,
      lastName,
      email,
      password,
    };

    return this.http.post(`${config.SERVER_URL}/api/users/signup`, body);
  }
}
