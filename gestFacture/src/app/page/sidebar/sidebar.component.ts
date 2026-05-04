import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../service/auth-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(private router: Router,
    private authService: AuthServiceService) { }

  user: any
  role: any
  simpleUser: boolean = false
  isOnline: boolean = navigator.onLine;

  ngOnInit() {
    this.user = this.authService.getUser();
    this.role = this.user.role
    if (this.role == "ROLE_USER") {
      this.simpleUser = true
    }
    // check la connexion
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🟢 Connecté à Internet');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('🔴 Hors ligne');
    });
  }

  go(path: string) {
    this.router.navigate([path]);
  }
}
