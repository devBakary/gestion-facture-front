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
  private authService: AuthServiceService) {}

  user: any
  role: any
  simpleUser: boolean = false

 ngOnInit() {
    this.user = this.authService.getUser();
    this.role = this.user.role
    console.log(this.role);
    
    if( this.role == "ROLE_USER"){
      this.simpleUser = true
    }
  }

  go(path: string) {
    this.router.navigate([path]);
  }
}
