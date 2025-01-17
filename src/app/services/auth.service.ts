import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost/rwtof/';
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) {}

  signup(email: string, username: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.apiKey}`);
    return this.http.post(`${this.apiUrl}/signup`, { email, username, password }, { headers });
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.apiKey}`);
    return this.http.post(`${this.apiUrl}/login`, { username, password }, { headers });
  }
}