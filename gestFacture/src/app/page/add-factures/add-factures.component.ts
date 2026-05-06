import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FacturesService } from '../../service/factures.service';
import Swal from 'sweetalert2';
import { OfflineSyncService } from '../../service/offline-sync.service';
import { fromEvent, merge, of } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-add-factures',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-factures.component.html',
  styleUrl: './add-factures.component.scss'
})
export class AddFacturesComponent {

  isLoading = false;
  isOnline: boolean = navigator.onLine;


  // 👇 CLIENT (remplace adresse seule)
  nomClient = '';
  telephone = '';
  adresse = '';

  // 👇 LIGNES
  lignes = [
    {
      description: '',
      quantite: 1,
      prix: 0
    }
  ];

  constructor(private service: FacturesService,
    private location: Location,
    private offlineSync: OfflineSyncService) { }

  ngOnInit() {

    this.isOnline = navigator.onLine;

    merge(
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false)),
      of(navigator.onLine)
    ).subscribe(status => {

      this.isOnline = status;
      console.log(status ? '🟢 Online' : '🔴 Offline');

      // sync avec délai (évite multi déclenchement)
      if (status) {
        setTimeout(() => {
          this.offlineSync.sync();
        }, 1000);
      }
    });
  }

  addLine() {
    this.lignes.push({
      description: '',
      quantite: 1,
      prix: 0
    });
  }

  getTotalFacture(): number {
    return this.lignes.reduce((total, ligne) => {
      return total + (ligne.quantite * ligne.prix);
    }, 0);
  }

  // 🔥 ENVOI BACKEND
  saveFacture() {

    const facture = {
      nomClient: this.nomClient,
      telephone: this.telephone,
      adresse: this.adresse,
      lignes: this.lignes.map(l => ({
        description: l.description,
        quantite: l.quantite,
        prixUnitaire: l.prix
      }))
    };

    this.isLoading = true;

    Swal.fire({
      title: 'Enregistrement...',
      text: 'Veuillez patienter',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    // ================= ONLINE =================
    if (this.isOnline) {

      this.service.createFacture(facture).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.close();

          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Facture enregistrée'
          });

          this.resetForm();
        },

        error: () => {
          console.log('❌ erreur API → fallback offline');

          this.offlineSync.saveOffline(facture);

          this.isLoading = false;
          Swal.close();

          Swal.fire({
            icon: 'warning',
            title: 'Hors ligne',
            text: 'Facture sauvegardée localement'
          });

          this.resetForm();
        }
      });

    }
    // ================= OFFLINE =================
    else {
      const factureOffline = {
        ...facture,
        total: this.getTotalFacture(), // 🔥 ajouté uniquement ici
        date: new Date().toISOString().split('T')[0], // utile pour affichage
        isOffline: true
      };

      this.offlineSync.saveOffline(factureOffline);

      this.isLoading = false;
      Swal.close();

      Swal.fire({
        icon: 'info',
        title: 'Mode hors ligne',
        text: 'Facture sauvegardée localement'
      });

      this.resetForm();
    }
  }

  // 🔄 reset
  resetForm() {
    this.nomClient = '';
    this.telephone = '';
    this.adresse = '';
    this.lignes = [
      { description: '', quantite: 1, prix: 0 }
    ];
  }

  goBack() {
    this.location.back();
  }
}