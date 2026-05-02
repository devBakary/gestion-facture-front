import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FacturesService } from '../../service/factures.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-factures',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factures.component.html',
  styleUrl: './factures.component.scss'
})
export class FacturesComponent {

  facture: any
  factureId: any
  constructor(private service: FacturesService, private route: ActivatedRoute,
    private router: Router
  ){}
    ngOnInit() {
    this.factureId = this.route.snapshot.params['id'];
    this.service.getAllFacture().subscribe((data: any) => {
      this.facture = data;
      // this.facture = data.slice(-5).reverse();
      console.log(this.facture)
    })
  }

    openDetail(id: number) {
    console.log("Navigation vers:", id);
    this.router.navigate(['/nav/detail', id]);
  }
   activeFilter = 'Toutes';

  factures = [
    {
      nom: 'Idrissa Bah',
      ref: 'F-2026-0002',
      date: '21/04/2026',
      montant: 93000,
      statut: 'PAYÉE'
    },
    {
      nom: 'Mariam Diallo',
      ref: 'F-2026-0001',
      date: '21/04/2026',
      montant: 1035000,
      statut: 'PAYÉE'
    }
  ];

  setFilter(filter: string) {
    this.activeFilter = filter;
  }
}
