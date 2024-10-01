import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = `${environment.apiUrl}token/`;

  constructor(private http: HttpClient) {}

  authenticate(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { username, password });
  }

  // Store token in localStorage
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Retrieve token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Implement the logout method
  logout() {
    localStorage.removeItem('token');
  }
}


