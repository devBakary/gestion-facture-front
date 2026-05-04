import { Component } from '@angular/core';
import { UtilisateurService } from '../../service/utilisateur.service';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../service/auth-service.service';
import { FacturesService } from '../../service/factures.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss'
})
export class ListUserComponent {

  constructor(private service: UtilisateurService,
    private authservice: AuthServiceService,
    private fservice: FacturesService,
    private router: Router
  ) { }
  stats = {
    totalUsers: 0,
    admins: 0,
    simpleUsers: 0
  };

  user: any
  users: any
  facture: any
  ngOnInit() {
    this.user = this.authservice.getUser();

    this.service.getAll().subscribe({
      next: (data) => {
        this.users = data.filter((u: { role: string; }) => u.role !== 'ADMIN').slice(-5).reverse();
        this.stats.totalUsers = data.length;
      },
      error: (err) => {
        console.error(err);
      }
    });

    this.fservice.getAllFacture().subscribe({
      next: (data) => {
        this.facture = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  add() {
    this.router.navigate(['/nav/create-user']);
  }

}
