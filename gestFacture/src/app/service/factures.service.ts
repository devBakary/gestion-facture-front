
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturesService {

   private baseUrl = 'http://localhost:8080/api/factures';

  constructor(private http: HttpClient) {}

  createFacture(facture: any): Observable<any>  {
    return this.http.post(this.baseUrl, facture);
  }

  getFacture(id: number) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  getAllFacture() {
    return this.http.get(`${this.baseUrl}`);
  }
}
