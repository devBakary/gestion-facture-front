import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor(private http : HttpClient) { }
  private api = 'https://gestion-facture-back-production.up.railway.app/api/auth';

  createUser(user: any):Observable<any> {
  return this.http.post(`${this.api}/user`, user);
}
 updateUser(user: any):Observable<any> {
  return this.http.put(`${this.api}/me`, user);
}

getAll():Observable<any> {
  return this.http.get(`${this.api}/user`);
}
}
