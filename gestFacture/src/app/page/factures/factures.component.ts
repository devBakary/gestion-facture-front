import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FacturesService } from '../../service/factures.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { OfflineSyncService } from '../../service/offline-sync.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-factures',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './factures.component.html',
  styleUrl: './factures.component.scss'
})
export class FacturesComponent {

  facture: any[] = [];
  factureId: any;

  p: number = 1;

  searchTerm: string = '';
  activeFilter: string = 'TOUTES';

  selectionMode = false;
  selectedFactures: number[] = [];

  isOnline: boolean = navigator.onLine;

  constructor(
    private service: FacturesService,
    private route: ActivatedRoute,
    private router: Router,
    private offlineSync: OfflineSyncService
  ) { }

  ngOnInit() {

    this.factureId = this.route.snapshot.params['id'];

    this.loadFactures();

    merge(
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false)),
      of(navigator.onLine)
    ).subscribe(status => {

      this.isOnline = status;

      if (status) {
        this.offlineSync.sync();
        this.loadFactures();
      }
    });
  }

  // =========================
  // CHARGEMENT DATA
  // =========================
  loadFactures() {

    if (this.isOnline) {

      this.service.getMyFacture().subscribe((data: any) => {
        this.facture = data || [];
      });

    } else {

      this.facture = this.offlineSync.getPending();
    }
  }

  // =========================
  // FILTRE COMBINÉ
  // =========================
  get filteredFactureList() {

    if (!this.facture) return [];

    return this.facture.filter((f: any) => {

      // STATUT
      const matchStatut =
        this.activeFilter === 'TOUTES' ||
        f.statut === this.activeFilter;

      // SEARCH SAFE
      const search = (this.searchTerm || '').trim().toLowerCase();

      const matchSearch =
        (f.nomClient || '').toLowerCase().includes(search) ||
        (f.numeroFacture || '').toLowerCase().includes(search) ||
        (f.dateFacture || '').toLowerCase().includes(search);

      return matchStatut && matchSearch;
    });
  }

  // =========================
  // FILTRE STATUT
  // =========================
  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  // =========================
  // NAVIGATION
  // =========================
  openDetail(id: number) {
    if (!this.selectionMode) {
      this.router.navigate(['/nav/detail', id]);
    }
  }

  add() {
    this.router.navigate(['/nav/add-facture']);
  }

  // =========================
  // DELETE SIMPLE
  // =========================
  deleteFacture(id: number) {

    if (this.isOnline) {

      this.service.deleteFacture(id).subscribe({
        next: () => this.loadFactures(),
        error: (err) => console.log('❌ erreur suppression', err)
      });

    } else {

      const pending = this.offlineSync.getPending();

      const updated = pending.filter((f: any) => f.tempId !== id);

      localStorage.setItem('pending_factures', JSON.stringify(updated));

      this.loadFactures();
    }
  }

  // =========================
  // MODE SELECTION
  // =========================
  toggleSelectionMode() {
    this.selectionMode = !this.selectionMode;

    if (!this.selectionMode) {
      this.selectedFactures = [];
    }
  }

  toggleSelection(id: number) {

    const index = this.selectedFactures.indexOf(id);

    if (index > -1) {
      this.selectedFactures.splice(index, 1);
    } else {
      this.selectedFactures.push(id);
    }
  }

  isSelected(id: number): boolean {
    return this.selectedFactures.includes(id);
  }

  // =========================
  // DELETE MULTIPLE
  // =========================
  deleteSelected() {

    if (this.selectedFactures.length === 0) return;

    Swal.fire({
      title: 'Supprimer ?',
      text: `${this.selectedFactures.length} facture(s)`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {

      if (!result.isConfirmed) return;

      this.service.deleteMultipleFactures(this.selectedFactures)
        .subscribe({

          next: () => {

            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Factures supprimées'
            });

            this.selectedFactures = [];
            this.loadFactures();
          },

          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Erreur suppression'
            });
          }
        });
    });
  }
}