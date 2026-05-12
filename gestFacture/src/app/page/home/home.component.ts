import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FacturesService } from '../../service/factures.service';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../service/auth-service.service';
import { fromEvent, merge, of } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';
import { LoaderComponent } from '../../Config/loader/loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  totalGeneral: number = 0;
  totalJour: number = 0;
  factures: any
  facture: any
  user: any
  isOnline: boolean = navigator.onLine;
  loading = false;
  constructor(private service: FacturesService,
    private router: Router,
    private authservice: AuthServiceService
  ) { }

  ngOnInit() {
    
    this.user = this.authservice.getUser();
    this.loading = true;
    this.service.getMyFacture().subscribe((data: any) => {
      this.factures = data;
      this.facture = data.slice(-5).reverse();
      this.calculateTotals();
       this.loading = false;
    });
    // check la connexion
    this.isOnline = navigator.onLine;

    merge(
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false)),
      of(navigator.onLine)
    ).subscribe(status => {
      this.isOnline = status;
    });
  }

  calculateTotals() {
    // TOTAL GLOBAL
    this.totalGeneral = this.factures.reduce((sum: number, f: any) => {
      return sum + (f.total || 0);
    }, 0);

    // DATE DU JOUR
    const today = new Date().toISOString().split('T')[0];

    // TOTAL DU JOUR
    this.totalJour = this.factures
      .filter((f: any) => f.dateFacture === today)
      .reduce((sum: number, f: any) => {
        return sum + (f.total || 0);
      }, 0);
  }

  add() {
    this.router.navigate(['/nav/add-facture']);
  }
  aller() {
    this.router.navigate(['/nav/factures']);
  }
}
