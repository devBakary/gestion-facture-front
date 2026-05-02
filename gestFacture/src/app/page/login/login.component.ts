import { Component } from '@angular/core';
import { AuthServiceService } from '../../service/auth-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    private router: Router
  ) {}

  login() {
    this.loading = true;
    this.error = '';
    console.log(this.form)

    this.authService.login(this.form).subscribe({
      
      next: (res: any) => {
        this.authService.saveToken(res);
        this.router.navigate(['/factures']);
      },
      error: () => {
        this.error = 'Identifiants incorrects';
        this.loading = false;
      }
    });
  }
}
