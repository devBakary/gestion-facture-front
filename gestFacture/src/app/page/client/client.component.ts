import { Component } from '@angular/core';
import { FacturesService } from '../../service/factures.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
// import { Ng2SearchPipeModule } from 'ng2-search-filter/src/ng2-filter.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {

  factureId: any
  clients: any
  p: number = 1;
  filteredUsers: any[] = [];
  searchTerm: string = '';

  constructor(private service: FacturesService, private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit() {
    this.factureId = this.route.snapshot.params['id'];
    this.service.getAllFacture().subscribe((data: any) => {
      this.clients = data;
      this.applyFilter();
    })
  }
  applyFilter() {
    this.filteredUsers = this.clients.filter((u: any) =>
      (u.nomClient || '').toLowerCase().includes((this.searchTerm || '').toLowerCase())
    );
  }

  openDetail(id: number) {
    this.router.navigate(['/nav/detail', id]);
  }

}
