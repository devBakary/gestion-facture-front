import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacturesService } from '../../service/factures.service';
import { AuthServiceService } from '../../service/auth-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detail-facture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-facture.component.html',
  styleUrl: './detail-facture.component.scss'
})
export class DetailFactureComponent {

  factureId: any
  factures: any
  articles: any
  userData: any
  user: any
  constructor(private route: ActivatedRoute,
    private service: FacturesService,
    private authService: AuthServiceService,
    private location: Location
  ) { }

  ngOnInit() {
    this.factureId = this.route.snapshot.params['id'];
    this.loadDocuments();
    this.user = this.authService.getUser();
  }

  loadDocuments() {
    this.service.getFacture(this.factureId)
      .subscribe((data: any) => {

        this.factures = data;
        this.articles = data.lignes;
        this.userData = data.user
      });
  }

  facture = {
    numero: 'F-2026-000',
    total: 1035000,
    client: 'Mariam Diallo',
    phone: '90675432',
    date: '21/04/2026',
    statut: 'Payée',
    article: 'Iphone 17 pro max',
    quantite: 1,
    prix: 1035000
  };

  statuts = [
    'Brouillon',
    'Envoyée',
    'Payée',
    'Annulée'
  ];

  printFacture() {
    this.printMode = true;

    setTimeout(() => {
      window.print();
      this.printMode = false;
    }, 300);
  }

  // pour le popup
  printMode = false;

  openTicket() {
    this.printMode = true;
  }

  closeTicket() {
    this.printMode = false;
  }

  goBack() {
    this.location.back();
  }

  // supprimer
  deleteFacture(id: number) {

    this.service.deleteFacture(id).subscribe({
      next: () => {
        console.log('✔ supprimé');

        // refresh liste
        this.loadDocuments();
      },
      error: (err) => {
        console.log('❌ erreur suppression', err);
      }
    });

  }
}
