import { Injectable } from '@angular/core';
import { FacturesService } from './factures.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineSyncService {

  private STORAGE_KEY = 'pending_factures';
  private isSyncing = false; // 🔒 verrou

  constructor(private factureService: FacturesService) {}

  // ================================
  // 🔹 SAVE OFFLINE
  // ================================
  saveOffline(facture: any) {

    const pending = this.getPending();

    // éviter doublon
    facture.tempId = Date.now();

    pending.push(facture);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pending));

    console.log('📦 Facture stockée offline');
  }

  // ================================
  // 🔹 GET PENDING
  // ================================
  getPending(): any[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  // ================================
  // 🔹 CLEAR
  // ================================
  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // ================================
  // 🔥 SYNC (CORRIGÉE)
  // ================================
  sync() {

    if (this.isSyncing) {
      console.log('⛔ Sync déjà en cours');
      return;
    }

    const pending = this.getPending();

    if (pending.length === 0) return;

    this.isSyncing = true;

    console.log('🔄 Sync démarrée...', pending.length);

    const processNext = (index: number) => {

      if (index >= pending.length) {
        console.log('✅ Sync terminée');
        this.clear();
        this.isSyncing = false;
        return;
      }

      const facture = pending[index];

      this.factureService.createFacture(facture).subscribe({
        next: () => {
          console.log('✔ Facture synchronisée');
          processNext(index + 1);
        },
        error: (err) => {
          console.log('❌ Erreur sync', err);
          this.isSyncing = false;
        }
      });
    };

    processNext(0);
  }
}