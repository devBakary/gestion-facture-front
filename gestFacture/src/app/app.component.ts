import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthServiceService } from './service/auth-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'gestFacture';

  constructor(private auth: AuthServiceService){}

  ngOnInit(): void {

  this.auth.restoreSession()?.subscribe({

    next: (user) => {

      this.auth.saveUser(user);

      console.log('Session restaurée');

    },

    error: () => {

      this.auth.logout();

    }

  });

}
}
