import { Injectable } from '@angular/core';
import { FacturesService } from './factures.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineSyncService {

  private STORAGE_KEY = 'pending_factures';
  private isSyncing = false; 

  constructor(private factureService: FacturesService) {}

  // ================================
  //  SAVE OFFLINE
  // ================================
  saveOffline(facture: any) {

    const pending = this.getPending();

    // éviter doublon
    facture.tempId = Date.now();

    pending.push(facture);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pending));
  }

  // ================================
  //  GET PENDING
  // ================================
  getPending(): any[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  // ================================
  //  CLEAR
  // ================================
  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // ================================
  //  SYNC (CORRIGÉE)
  // ================================
  sync() {

    if (this.isSyncing) {
      return;
    }

    const pending = this.getPending();

    if (pending.length === 0) return;

    this.isSyncing = true;

    const processNext = (index: number) => {

      if (index >= pending.length) {
        this.clear();
        this.isSyncing = false;
        return;
      }

      const facture = pending[index];

      this.factureService.createFacture(facture).subscribe({
        next: () => {
          processNext(index + 1);
        },
        error: (err) => {
          this.isSyncing = false;
        }
      });
    };
    processNext(0);
  }
}