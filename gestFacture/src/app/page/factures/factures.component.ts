import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FacturesService } from '../../service/factures.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { fromEvent, merge, of } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';
import { OfflineSyncService } from '../../service/offline-sync.service';

@Component({
  selector: 'app-factures',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './factures.component.html',
  styleUrl: './factures.component.scss'
})
export class FacturesComponent {

  facture: any
  factureId: any
  p: number = 1;
  filteredFacture: any
  searchTerm: string = ''
  isOnline: boolean = navigator.onLine;
  constructor(private service: FacturesService,
    private route: ActivatedRoute,
    private router: Router,
    private offlineSync: OfflineSyncService
  ) { }
  ngOnInit() {
    this.factureId = this.route.snapshot.params['id'];
    this.loadFactures();
    // this.service.getAllFacture().subscribe((data: any) => {
    //   this.facture = data;
    //  this.applyFilter();
    // });
    merge(
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false)),
      of(navigator.onLine)
    ).subscribe(status => {

      this.isOnline = status;
      // 🔥 SYNC AUTOMATIQUE QUAND INTERNET REVIENT
      if (status) {
        this.offlineSync.sync();
        this.loadFactures(); // refresh UI
      }
    });
  }
  loadFactures() {

  if (this.isOnline) {

    // 🟢 ONLINE → API seulement
    this.service.getMyFacture().subscribe((data: any) => {

      this.facture = data || [];
      this.applyFilter();

    });

  } else {

    // 🔴 OFFLINE → localStorage seulement
    const offlineFactures = this.offlineSync.getPending();

    this.facture = offlineFactures;
    console.log(this.facture);
    
    this.applyFilter();
  }
}

  // loadFactures() {
  //   this.service.getMyFacture().subscribe((data: any) => {
  //     this.facture = data;
  //     this.applyFilter();
  //   });
  // }
  applyFilter() {
    this.filteredFacture = this.facture.filter((u: any) =>
      (u.nomClient || u.numeroFacture || u.dateFacture || '').toLowerCase().includes((this.searchTerm || '').toLowerCase())
    );
  }

  openDetail(id: number) {
    console.log("Navigation vers:", id);
    this.router.navigate(['/nav/detail', id]);
  }

  add() {
    this.router.navigate(['/nav/add-facture']);
  }


  activeFilter = 'Toutes';


  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  // supprimer
  deleteFacture(id: number) {

  if (this.isOnline) {

    this.service.deleteFacture(id).subscribe({
      next: () => {
        console.log('✔ supprimé');

        // refresh liste
        this.loadFactures();
      },
      error: (err) => {
        console.log('❌ erreur suppression', err);
      }
    });

  } else {
    console.log('📴 suppression offline');

    // 🔥 suppression localStorage
    const pending = this.offlineSync.getPending();

    const updated = pending.filter((f: any) => f.tempId !== id);

    localStorage.setItem('pending_factures', JSON.stringify(updated));

    this.loadFactures();
  }
}
}
