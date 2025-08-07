import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;

  constructor() { }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  loginAdmin(username: string, phoneNumber: string, password: string): boolean {
    // This is a placeholder for actual authentication logic.
    // In a real application, you would send credentials to a backend
    // and receive a JWT token upon successful authentication.
    if (username === 'admin' && phoneNumber === '1234567890' && password === 'password') {
      // Simulate token reception
      this.setToken('fake-jwt-token'); // Replace with actual token from backend
      return true;
    }
    return false;
  }

  isAdminUser(): boolean {
    return this.token !== null;
  }

  logoutAdmin(): void {
    this.token = null;
  }
}
