import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard = (roles: string[]): CanActivateFn => {

  return () => {

    const router = inject(Router);

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // pas connecté
    if (!token) {

      router.navigate(['/login']);
      return false;

    }

    // rôle autorisé
    if (role && roles.includes(role)) {
      return true;
    }

    // accès refusé
    router.navigate(['/login']);
    return false;

  };

};