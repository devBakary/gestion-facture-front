import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard= (roles: string[]):CanActivateFn => {
  return () => {

    const router = inject(Router);
    const role = localStorage.getItem('role');

    if (role && roles.includes(role)) {
      return true;
    }

    router.navigate(['/login']);
    return false;
  };
};