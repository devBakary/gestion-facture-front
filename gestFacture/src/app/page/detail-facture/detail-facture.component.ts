import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacturesService } from '../../service/factures.service';
import { AuthServiceService } from '../../service/auth-service.service';

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
  constructor(private route: ActivatedRoute,
              private service: FacturesService,
              private authService: AuthServiceService
  ){}

  ngOnInit(){
    this.factureId = this.route.snapshot.params['id'];
    this.loadDocuments();
    const user = this.authService.getUser();
    console.log(user)
  }

   loadDocuments(){
    this.service.getFacture(this.factureId)
    .subscribe((data:any)=>{

      this.factures = data;
      this.articles = data.lignes;

      console.log("Documents:", this.factures);
       console.log("arti:", this.articles);

    });
  }

   facture = {
    numero: 'F-2026-0001',
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

// printMode = false;

// openTicket() {
//   this.printMode = true;
// }

// closeTicket() {
//   this.printMode = false;
// }

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
}
