import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { FacturesService } from '../../service/factures.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-udate-facture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './udate-facture.component.html',
  styleUrl: './udate-facture.component.scss'
})
export class UdateFactureComponent {
  facture: any = {
    nomClient: '',
    adresse: '',
    telephone: '',
    lignes: []
  };

  id: any;

  constructor(
    private route: ActivatedRoute,
    private service: FacturesService,
    private router: Router,
    private location : Location
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.service.getFacture(this.id).subscribe({
      next: (data) => {
        this.facture = data;

        // sécurité
        if (!this.facture.lignes) {
          this.facture.lignes = [];
        }
      },
      error: () => {
        Swal.fire('Erreur', 'Facture introuvable', 'error');
      }
    });
  }

  addLine() {
    this.facture.lignes.push({
      description: '',
      quantite: 1,
      prixUnitaire: 0
    });
  }

  removeLine(index: number) {
    this.facture.lignes.splice(index, 1);
  }

  calculateTotal() {
    return this.facture.lignes
      .reduce((sum: number, l: any) => sum + (l.quantite * l.prixUnitaire), 0);
  }

  save() {
    this.facture.total = this.calculateTotal();

    this.service.updateFacture(this.id, this.facture)
      .subscribe({
        next: () => {
          Swal.fire('Succès', 'Facture modifiée', 'success');
           this.location.back();;
        },
        error: () => {
          Swal.fire('Erreur', 'Modification échouée', 'error');
        }
      });
  }

  goBack() {
     this.location.back();
  }
}
