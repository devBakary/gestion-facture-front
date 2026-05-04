import { Component } from '@angular/core';
import { AuthServiceService } from '../../service/auth-service.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
    private router: Router
  ){}

ngOnInit() {
  //  this.user = this.authservice.getUser();
  
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

logout() {
  localStorage.clear();
 this.router.navigate(['/login']);
}

}
