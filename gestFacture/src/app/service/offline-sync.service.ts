import { Injectable } from '@angular/core';
import { FacturesService } from './factures.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineSyncService {

  private STORAGE_KEY = 'pending_factures';

  constructor(private factureService: FacturesService) {}

  // 🔹 sauvegarde offline
  saveOffline(facture: any) {
    const pending = this.getPending();
    pending.push({
      ...facture,
      tempId: Date.now()
    });

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pending));
  }

  // 🔹 récupérer queue
  getPending(): any[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  // 🔹 sync vers backend
  sync() {
    const pending = this.getPending();

    if (pending.length === 0) return;

    console.log('🔄 Sync en cours...', pending.length);

    pending.forEach((facture: any, index: number) => {
      this.factureService.createFacture(facture).subscribe({
        next: () => {
          console.log('✔ Facture synchronisée');

          // retirer après succès
          const updated = this.getPending().filter(f => f.tempId !== facture.tempId);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
        },
        error: (err) => {
          console.log('❌ Erreur sync', err);
        }
      });
    });
  }

  // 🔹 vider queue
  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}