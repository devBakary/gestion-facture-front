import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor(private http: HttpClient) { }
 private api = 'https://gestion-facture-back-production.up.railway.app/api/auth';
  // private api = 'http://localhost:8080/api/auth';
  createUser(user: any): Observable<any> {
    return this.http.post(`${this.api}/user`, user);
  }
  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.api}/me`, user);
  }
// changer de mot de passe
  changerMDP(data: any) {
    return this.http.put(
      `${this.api}/change-password`,
      data
    );
  }
// demande de reinitialisation
  requestReset(username: string) {
  return this.http.put(
    `${this.api}/request-reset`,
    {},
    {
      params: { username }
    }
  );
}
// reinialisation par l'admin
  AdminReset(id: string) {
  return this.http.put(
    `${this.api}/admin/reset-password/${id}`,{}
  );
}

  getAll(): Observable<any> {
    return this.http.get(`${this.api}/user`);
  }
}
