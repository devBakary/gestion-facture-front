import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../service/auth-service.service';
import { CommonModule } from '@angular/common';
import { merge, fromEvent, mapTo, of } from 'rxjs';
import { OfflineSyncService } from '../../service/offline-sync.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(private router: Router,
    private authService: AuthServiceService,
    private offlineSync: OfflineSyncService) { }

  user: any
  role: any
  simpleUser: boolean = false
  isOnline: boolean = navigator.onLine;
  showOfflineBanner = false

  ngOnInit() {
    this.user = this.authService.getUser();
    this.role = this.user.role
    if (this.role == "ROLE_USER") {
      this.simpleUser = true
    }
    merge(
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false)),
      of(navigator.onLine)
    ).subscribe(status => {
      this.isOnline = status;
      if (!status) {

        this.showOfflineBanner = true;

        // masquer après 4 secondes
        setTimeout(() => {
          this.showOfflineBanner = false;
        }, 10000);
      }
    });
  }
  hide(){
    this.showOfflineBanner = false;
  }

  go(path: string) {
    this.router.navigate([path]);
  }
}
