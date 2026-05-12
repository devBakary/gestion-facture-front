import { Component } from '@angular/core';
import { AuthServiceService } from '../../service/auth-service.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilisateurService } from '../../service/utilisateur.service';
import Swal from 'sweetalert2';
import { LoaderComponent } from '../../Config/loader/loader.component';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent {

  user: any = {};
  constructor(private authservice: AuthServiceService,
    private router: Router,
    private userService: UtilisateurService
  ){}
 loading = false;
ngOnInit() {
   this.loading = true;
   this.authservice.getMe().subscribe({
      next: (data) => {
        this.user = data
         this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      }
    })
   
}
updateProfile() {
  this.userService.updateUser(this.user).subscribe(() => {
    alert("Profil mis à jour !");
  });
}

changePasswordPopup() {

  Swal.fire({
    title: 'Modifier le mot de passe',
    html: `
      <input type="password" id="oldPassword" class="swal2-input" placeholder="Ancien mot de passe">
      <input type="password" id="newPassword" class="swal2-input" placeholder="Nouveau mot de passe">
      <input type="password" id="confirmPassword" class="swal2-input" placeholder="Confirmer le mot de passe">
    `,
    showCancelButton: true,
    confirmButtonText: 'Modifier',
    cancelButtonText: 'Annuler',
    focusConfirm: false,
    preConfirm: () => {

      const oldPassword = (document.getElementById('oldPassword') as HTMLInputElement).value;
      const newPassword = (document.getElementById('newPassword') as HTMLInputElement).value;
      const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

      if (!oldPassword || !newPassword || !confirmPassword) {
        Swal.showValidationMessage('Tous les champs sont obligatoires');
        return false;
      }

      if (newPassword !== confirmPassword) {
        Swal.showValidationMessage('Les nouveaux mots de passe ne correspondent pas');
        return false;
      }

      return { oldPassword, newPassword };
    }
  }).then((result) => {

    if (result.isConfirmed && result.value) {

      this.userService.changerMDP( result.value)
        .subscribe({
          next: (res: any) => {

            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: res.message
            });

          },
          error: (err) => {

            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: err.error?.message || 'Erreur lors du changement de mot de passe'
            });

          }
        });
    }
  });
}

logout() {
  localStorage.clear();
 this.router.navigate(['/login']);
}

}
