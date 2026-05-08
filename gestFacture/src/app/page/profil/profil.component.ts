import { Component } from '@angular/core';
import { AuthServiceService } from '../../service/auth-service.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilisateurService } from '../../service/utilisateur.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent {

  user: any = {};
  constructor(private authservice: AuthServiceService,
    private router: Router,
    private userService: UtilisateurService
  ){}

ngOnInit() {
  
   this.authservice.getMe().subscribe({
      next: (data) => {
        this.user = data
         console.log(this.user);
      },
      error: (err) => {
        console.error(err);
      }
    })
   
}
updateProfile() {
  this.userService.updateUser(this.user).subscribe(() => {
    alert("Profil mis à jour !");
  });
}

logout() {
  localStorage.clear();
 this.router.navigate(['/login']);
}

}
