import { Component } from '@angular/core';
import { UtilisateurService } from '../../service/utilisateur.service';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../service/auth-service.service';
import { FacturesService } from '../../service/factures.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
  request: any
  id:any
  ngOnInit() {
    this.user = this.authservice.getUser();

    this.service.getAll().subscribe({
      next: (data) => {
        this.users = data.filter((u: { role: string; }) => u.role !== 'ADMIN').slice(-5).reverse();
        this.request = data.filter((u: { resetRequested: boolean; }) => u.resetRequested == true)
        console.log(this.request);
        
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

 resetPassword(user: any) {

  Swal.fire({
    title: 'Réinitialisation',
    text: `Réinitialiser le mot de passe de ${user.username} ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui',
    cancelButtonText: 'Non',
    confirmButtonColor: '#162a57'
  }).then((result) => {

    if (result.isConfirmed) {

      this.service.AdminReset(user.id)
        .subscribe({

          next: (res: any) => {

            user.resetRequested = false;

            Swal.fire({
              icon: 'success',
              title: 'Mot de passe réinitialisé',
              html: `
                <p><b>${user.username}</b></p>
                <p>Nouveau mot de passe :</p>
                <b>${res.newPassword}</b>
              `
            });

          },

          error: () => {

            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Impossible de réinitialiser le mot de passe'
            });

          }

        });

    }

  });

}

  add() {
    this.router.navigate(['/nav/create-user']);
  }

}
