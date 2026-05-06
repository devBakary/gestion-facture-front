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
    private offlineSync: OfflineSyncService) {}

  ngOnInit() {
    // 🔹 statut initial internet
  this.isOnline = navigator.onLine;

  // 🔥 gestion online/offline propre
  merge(
    fromEvent(window, 'online').pipe(mapTo(true)),
    fromEvent(window, 'offline').pipe(mapTo(false)),
    of(navigator.onLine)
  ).subscribe(status => {

    this.isOnline = status;
    console.log(status ? '🟢 Online' : '🔴 Offline');

    // 🔥 SYNC AUTOMATIQUE QUAND INTERNET REVIENT
    if (status) {
      this.offlineSync.sync();
      // this.loadFactures(); // refresh UI
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

    console.log('Facture envoyée:', facture);
     this.isLoading = true;
    
       // Loader
  Swal.fire({
    title: 'Enregistrement...',
    text: 'Veuillez patienter',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
   if(this.isOnline){ 
    this.service.createFacture(facture).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log('Facture enregistrée', res);
         Swal.close();

      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Facture enregistrée avec succès'
      });

        // alert('Facture enregistrée avec succès');
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
         this.isLoading = false;
         Swal.close();

      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Erreur lors de l'enregistrement"
      });
        // alert('Erreur lors de l’enregistrement');
      }
    });}
    else {
    console.log('📴 Offline → sauvegarde locale');
    this.offlineSync.saveOffline(facture);
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