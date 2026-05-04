import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FacturesService } from '../../service/factures.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-factures',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-factures.component.html',
  styleUrl: './add-factures.component.scss'
})
export class AddFacturesComponent {

  isLoading = false;

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

  constructor(private service: FacturesService, private location: Location) {}

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
    });
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