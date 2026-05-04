import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthServiceService } from '../../service/auth-service.service';
import { UtilisateurService } from '../../service/utilisateur.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {

   user: any = {
    username: '',
    password: '',
    role: 'ROLE_USER',
    name: '',
    adresse: '',
    numero: '',
    description: '',
    domaine: ''
  };

  constructor(private service: UtilisateurService) {}

  createUser() {
    this.service.createUser(this.user).subscribe({
      next: (res) => {
        Swal.fire('Succès', 'Utilisateur créé', 'success');
        this.resetForm();
      },
      error: (err) => {
        Swal.fire('Erreur', err.error?.message || 'Erreur création', 'error');
      }
    });
  }

  resetForm() {
    this.user = {
      username: '',
      password: '',
      role: 'ROLE_USER',
      name: '',
      adresse: '',
      numero: '',
      description: '',
      domaine: ''
    };
  }
}
