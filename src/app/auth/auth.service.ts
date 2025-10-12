import {Injectable, PLATFORM_ID, inject, Inject} from '@angular/core'; // Import PLATFORM_ID and inject
import { isPlatformBrowser } from '@angular/common'; // Import isPlatformBrowser
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, of, throwError, BehaviorSubject, catchError} from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import {environment} from '../../environments/environment';

interface LoginResponse {
  token: string;
  message: string;
}

interface RegisterResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = environment.apiBaseUrl
  private _isAuthenticated = new BehaviorSubject<boolean>(false); // Initialize with false

  public isAuthenticated: boolean = false;

  constructor(
    private http: HttpClient, // Inject HttpClient
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      this._isAuthenticated.next(!!token);
    }
  }

  private checkAuthenticationStatus(): boolean {
    // Ensure this is only called in the browser
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('authToken');
    }
    return false; // Return false if not in browser
  }

  get isAuthenticated$(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }


  login(name:string, phoneNumber: string): Observable<String> {
    const loginEndpoint = `${this.baseUrl}/login`;
    const body = { name:name, phoneNumber: phoneNumber };
    return this.http.post(loginEndpoint, body, { responseType: 'text' });
  }

  verifyOtp(phoneNumber: string, otp: string): Observable<LoginResponse> {

    const verifyOtpEndpoint = `${this.baseUrl}/login/verify-otp`;
    const body = {phoneNumber:phoneNumber , otp: otp };
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.post<LoginResponse>(verifyOtpEndpoint, body, { headers }).pipe(
      tap((response: LoginResponse) => {

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('authToken', response.token);
        }
        this._isAuthenticated.next(true); // Emit true for logged in
        console.log('OTP verification successful, token stored.');
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle errors from the backend API call
        let errorMessage = 'An unknown error occurred during OTP verification.';
        if (error.error instanceof ErrorEvent) {
          // Client-side or network error
          errorMessage = `Network Error: ${error.error.message}`;
        } else {
          // Backend returned an unsuccessful response code
          console.error(`Backend returned code ${error.status}, body was: `, error.error);
          if (error.status === 400) {
            errorMessage = 'Invalid OTP. Please try again.';
          } else if (error.error && error.error.message) {
            // Assuming your backend sends an error message in the response body
            errorMessage = error.error.message;
          } else if (error.statusText) {
            errorMessage = `OTP verification failed: ${error.statusText}`;
          }
        }
        console.error('OTP verification error:', errorMessage);
        // Re-throw the error so components can handle it
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  reSendOtp(phoneNumber: string): Observable<any> {
    const resendOtpEndpoint = `${this.baseUrl}/resend-otp`;
    const body = { phoneNumber: phoneNumber };
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(resendOtpEndpoint, body, { headers });
  }

  register(user:any): Observable<string> {
    const registerEndpoint = `${environment.apiBaseUrl}/register`;
    return this.http.post(registerEndpoint, user,{ responseType: 'text' });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
    }
    this._isAuthenticated.next(false); // Emit false for logged out
    console.log('Simulated Logout');
  }

  isUserAuthenticated(): boolean {
    return this.checkAuthenticationStatus();
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  getUserName() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.name || 'Guest'; // Return userName or 'Guest' if not available
        } catch (e) {
          console.error('Error parsing token:', e);
          return 'Guest';
        }
      }
    }
    return 'Guest'; // Default if no token or not in browser
  }

  getUserId() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.userId || null; // Return user ID or null if not available
        } catch (e) {
          console.error('Error parsing token:', e);
          return null;
        }
      }
    }
    return null;
  }

  clearToken() {
    //clear token from local storage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
    }
  }

  //check isAdminUser
  isAdminUser(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const roles = payload.roles || [];
          if (Array.isArray(roles)) {
            return roles.includes('ROLE_ADMIN');
          }else {
            return false;
          }
        } catch (e) {
          console.error('Error parsing token:', e);
          return false;
        }
      }
    }
    return false; // Default if no token or not in browser
  }

  logoutAdmin() {
    //clear token from local storage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
    }
  }
}
