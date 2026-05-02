import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

    totalFactures = 2;
  chiffreAffaires = 1128000;

  recentes = [
    {
      nom: 'Idrissa Bah',
      ref: 'F-2026-0002',
      date: '21/04/2026',
      montant: 93000,
      status: 'SYNCHRO'
    }
  ];
}
