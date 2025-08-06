import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAdmin = false;

  constructor() { }

  loginAdmin(username: string, phoneNumber: string, password: string): boolean {
    if (username === 'admin' && phoneNumber === '1234567890' && password === 'password') {
      this.isAdmin = true;
      return true;
    }
    return false;
  }

  isAdminUser(): boolean {
    return this.isAdmin;
  }

  logoutAdmin(): void {
    this.isAdmin = false;
  }
}
