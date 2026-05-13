import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private api = 'https://gestion-facture-back-production.up.railway.app/api/auth';
  // private api = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(data: any): Observable<any> {
    return this.http.post(`${this.api}/login`, data);
  }

  getMe(): Observable<any> {
    return this.http.get<any>(`${this.api}/me`);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  restoreSession(): Observable<any> | null {

  const token = this.getToken();

  if (!token) {
    return null;
  }

  return this.getMe();
}
}
