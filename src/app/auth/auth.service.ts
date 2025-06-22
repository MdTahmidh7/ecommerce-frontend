import { Injectable, PLATFORM_ID, inject } from '@angular/core'; // Import PLATFORM_ID and inject
import { isPlatformBrowser } from '@angular/common'; // Import isPlatformBrowser
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

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

  private readonly baseUrl = 'http://localhost:8080/api/auth';
  private platformId = inject(PLATFORM_ID); // Inject PLATFORM_ID
  private _isAuthenticated = new BehaviorSubject<boolean>(false); // Initialize with false

  // Use a local variable to store the authentication status
  // It will be updated by checkAuthenticationStatus only on the browser
  public isAuthenticated: boolean = false;

  constructor(private http: HttpClient) {
    // Only check authentication status if running in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.isAuthenticated = this.checkAuthenticationStatus();
      this._isAuthenticated.next(this.isAuthenticated); // Emit initial status to BehaviorSubject
    }
  }

  /**
   * Checks the initial authentication status from localStorage.
   * This method should only be called in a browser environment.
   * @returns boolean indicating authentication status.
   */
  private checkAuthenticationStatus(): boolean {
    // Ensure this is only called in the browser
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('authToken');
    }
    return false; // Return false if not in browser
  }

  /**
   * Returns an observable of the authentication status.
   * Components can subscribe to this to react to changes.
   */
  get isAuthenticated$(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  /**
   * Simulates a login API call.
   * @param email The user's email.
   * @param password The user's password.
   * @returns An Observable of LoginResponse or an error.
   */
  login(email: string, password: string): Observable<LoginResponse> {
    // In a real app, you would make an HTTP request here.
    // For this simulation, we'll keep the localStorage interaction conditional.

    return of({ token: 'mock-jwt-token', message: 'Login successful!' }).pipe(
      delay(1500), // Simulate network delay
      tap(() => {
        if (email === 'test@example.com' && password === 'password123') {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('authToken', 'mock-jwt-token');
          }
          this._isAuthenticated.next(true); // Emit true for authenticated
          console.log('Simulated Login Success');
        } else {
          throw new Error('Invalid email or password');

        }
      })
    );
  }

  /**
   * Simulates a registration API call.
   * @param fullName The user's full name.
   * @param email The user's email.
   * @param password The user's password.
   * @returns An Observable of RegisterResponse or an error.
   */
  register(fullName: string, email: string, password: string): Observable<RegisterResponse> {
    // This part doesn't interact with localStorage directly, so no platform check needed here.
    return of({ message: 'Registration successful!' }).pipe(
      delay(1500), // Simulate network delay
      tap(() => console.log('Simulated Registration Success'))
    );
  }

  /**
   * Logs out the user (simulated).
   * In a real app, this would clear the token.
   */
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
}
