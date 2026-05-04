import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FacturesService } from '../../service/factures.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

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
  constructor(private service: FacturesService, private route: ActivatedRoute,
    private router: Router
  ){}
    ngOnInit() {
    this.factureId = this.route.snapshot.params['id'];
    this.service.getAllFacture().subscribe((data: any) => {
      this.facture = data;
     this.applyFilter();
    })
  }
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
}
