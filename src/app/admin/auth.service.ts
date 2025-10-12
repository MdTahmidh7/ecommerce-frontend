import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;

  constructor(private http: HttpClient) { }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  loginAdmin(name: string, phoneNumber: string) {
    return this.http.post(`${environment.apiBaseUrl}/login`, { name, phoneNumber });
  }

  verifyAdminOtp(phoneNumber: string, otp: string) {
    return this.http.post(`${environment.apiBaseUrl}/login/verify-otp`, { phoneNumber, otp });
  }

  isAdminUser(): boolean {
    return this.token !== null;
  }

  logoutAdmin(): void {
    this.token = null;
  }
}
