import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  signup(signupData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}signup`, signupData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  login(loginData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}login`, loginData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getProfile(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}userprofile`, {
      params: { userId: userId.toString() }
    });
  }
  logout() {
    console.log('Benutzer abgemeldet');
  }
}
