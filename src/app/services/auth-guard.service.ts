import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public authenticationService: AuthenticationService
      ) {}

  canActivate(): boolean {
    return this.authenticationService.isAuthenticated();
  }
}
