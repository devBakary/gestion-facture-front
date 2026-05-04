import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor(private http : HttpClient) { }
  private api = 'http://localhost:8080/api/auth';

  createUser(user: any):Observable<any> {
  return this.http.post(`${this.api}/user`, user);
}

getAll():Observable<any> {
  return this.http.get(`${this.api}/user`);
}
}
