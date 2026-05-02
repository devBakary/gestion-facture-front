// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';// Assure-toi que le chemin est correct
// import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { AuthServiceService } from '../service/auth-service.service';

// export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
//   const tokenService = inject(AuthServiceService);
//   const token = tokenService.getToken();

//   console.log('Intercepteur exécuté !'); // Log pour vérifier que l'intercepteur est bien appelé
//   console.log('Token récupéré :', token); // Vérifier si le token est bien récupéré

//   // Ajouter l'en-tête Authorization si le token existe
//   if (token) {
//     const authReq = req.clone({
//       headers: req.headers.set('Authorization', `Bearer ${token}`)
//     });
//     console.log('Requête avec en-tête Authorization :', authReq); // Log de la requête modifiée
//     return next(authReq); // Utilise next(authReq) pour passer la requête modifiée
//   }

//   console.log('Requête sans ajout de token');
//   return next(req); // Retourner la requête originale si pas de token
// };