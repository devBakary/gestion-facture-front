import { Component } from '@angular/core';
import { AuthServiceService } from '../../service/auth-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UtilisateurService } from '../../service/utilisateur.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form = {
    username: '',
    password: ''
  };

  loading = false;
  error = '';

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private uservice: UtilisateurService
  ) { }

  login() {
    this.loading = true;
    this.error = '';
    console.log(this.form)

    this.authService.login(this.form).subscribe({

      next: (res: any) => {
        console.log("LOGIN RESPONSE BRUT :", res);

        this.authService.saveToken(res.token);

        this.authService.getMe().subscribe(user => {

          console.log('USER CONNECTE:', user);

          this.authService.saveUser(user);

          this.router.navigate(['/nav/home']);
        });

      },
      error: () => {
        this.error = 'Identifiants incorrects';
        this.loading = false;
      }
    });
  }

  // mot de passe oulier
  forgotPassword() {

  Swal.fire({
    title: 'Réinitialisation',
    input: 'text',
    inputLabel: 'Entrez votre nom utilisateur',
    inputPlaceholder: 'Username',
    showCancelButton: true,
    confirmButtonText: 'Envoyer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#162a57',

    inputValidator: (value) => {

      if (!value) {
        return 'Veuillez entrer votre username';
      }

      return null;
    }

  }).then((result) => {

    if (result.isConfirmed) {

      const username = result.value;

      this.uservice.requestReset(username)
        .subscribe({

          next: (res: any) => {

            Swal.fire({
              icon: 'success',
              title: 'Demande envoyée',
              text: 'L’administrateur recevra votre demande'
            });

          },

          error: () => {

            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Utilisateur introuvable'
            });
          }
        });
    }
  });
}

}
