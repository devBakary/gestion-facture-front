import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FacturesService } from '../../service/factures.service';
import { AuthServiceService } from '../../service/auth-service.service';
import { Location } from '@angular/common';
import { LoaderComponent } from '../../Config/loader/loader.component';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-facture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-facture.component.html',
  styleUrl: './detail-facture.component.scss'
})
export class DetailFactureComponent {

  factureId: any
  factures: any
  articles: any
  userData: any
  user: any
  isEdit = false;
  originalFacture: any;
  constructor(private route: ActivatedRoute,
    private service: FacturesService,
    private authService: AuthServiceService,
    private location: Location, 
    public router: Router
  ) { }

  ngOnInit() {
    this.factureId = this.route.snapshot.params['id'];
    this.loadDocuments();
    this.user = this.authService.getUser();
  }

  loadDocuments() {
    this.service.getFacture(this.factureId)
      .subscribe((data: any) => {

        this.factures = data;
        this.articles = data.lignes;
        this.userData = data.user
      });
  }

  changeStatut(id: number, statut: string) {
    this.service.updateStatut(id, statut)
      .subscribe({
        next: () => {

          // refresh liste
          this.loadDocuments();
        },

        error: (err) => {
        }
      });
  }
  // 🔵 EDIT MODE
  enableEdit() {
    this.originalFacture = JSON.parse(JSON.stringify(this.factures));
    this.isEdit = true;
  }

  cancelEdit() {
    this.factures = JSON.parse(JSON.stringify(this.originalFacture));
    this.isEdit = false;
  }

  loading: any
  updateFacture() {

    this.loading = true;

    this.service.updateFacture(this.factures.id, {
      ...this.factures,
      articles: this.articles
    }).subscribe({

      next: () => {

        this.loading = false;
        this.isEdit = false;

        Swal.fire({
          icon: 'success',
          title: 'Facture modifiée',
          timer: 1500,
          showConfirmButton: false
        });

      },

      error: () => {

        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la modification'
        });

      }

    });

  }


  printFacture() {
    this.printMode = true;

    setTimeout(() => {
      window.print();
      this.printMode = false;
    }, 300);
  }

  // pour le popup
  printMode = false;

  openTicket() {
    this.printMode = true;
  }

  closeTicket() {
    this.printMode = false;
  }

  goBack() {
    this.location.back();
  }

  // supprimer
  deleteFacture(id: number) {

    this.service.deleteFacture(id).subscribe({
      next: () => {
        console.log('✔ supprimé');
        // this.loadDocuments();
        this.goBack();
      },
      error: (err) => {
      }
    });

  }
}
