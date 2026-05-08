
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
    return this.http.get(`${this.baseUrl}/getAll`);
  }
  getMyFacture() {
    return this.http.get(`${this.baseUrl}`);
  }

  updateStatut(id: number, statut: string) {

  return this.http.put(
    `${this.baseUrl}/${id}/statut?statut=${statut}`,
    {}
  );
}
  deleteFacture(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  deleteMultipleFactures(ids: number[]) {
  return this.http.delete(`${this.baseUrl}/delete-multiple`,
    {
      body: ids
    }
  );
}
}
