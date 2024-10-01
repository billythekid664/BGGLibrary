import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { traceUntilFirst } from '@angular/fire/performance';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

export const isAuthGuard: CanActivateFn = (route, state) => {
  let auth = inject(Auth);
  let router = inject(Router);
  return authState(auth).pipe(
    traceUntilFirst('auth'),
    map(u => {
      if (u) {
        router.navigate(['/']);
        return false;
      } 
      return true;
    }));
};
