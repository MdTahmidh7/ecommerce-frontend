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

  private readonly baseUrl = 'http://localhost:8080/api/auth';
  //private platformId = inject(PLATFORM_ID); // Inject PLATFORM_ID
  private _isAuthenticated = new BehaviorSubject<boolean>(false); // Initialize with false

  // Use a local variable to store the authentication status
  // It will be updated by checkAuthenticationStatus only on the browser
  public isAuthenticated: boolean = false;

  constructor(
    private http: HttpClient, // Inject HttpClient
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Check for token in localStorage on service initialization
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      this._isAuthenticated.next(!!token); // Set initial auth state based on token presence
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
   * @param phoneNumber
   * @param password The user's password.
   * @returns An Observable of LoginResponse or an error.
   */
  login(phoneNumber: string, password: string): Observable<LoginResponse> {
    // Define the endpoint for login
    const loginEndpoint = `${this.baseUrl}/login`;

    // Create the request body
    const body = { phoneNumber: phoneNumber, password };

    // Set HTTP headers, specifying content type as JSON
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Make the HTTP POST request to the backend
    return this.http.post<LoginResponse>(loginEndpoint, body, { headers }).pipe(
      tap((response: LoginResponse) => {
        // On successful login, store the token and update authentication status
        if (response.token) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('authToken', response.token);
          }
          this._isAuthenticated.next(true); // Emit true for authenticated
          console.log('Login successful:', response.message || 'Token received.');
        } else {
          // If no token is received but the call was successful, something is off
          console.warn('Login successful but no token received in response.');
          throw new Error('Authentication failed: No token received.');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle errors from the backend API call
        let errorMessage = 'An unknown error occurred during login.';
        if (error.error instanceof ErrorEvent) {
          // Client-side or network error
          errorMessage = `Network Error: ${error.error.message}`;
        } else {
          // Backend returned an unsuccessful response code
          console.error(`Backend returned code ${error.status}, body was: `, error.error);
          if (error.status === 401) {
            errorMessage = 'Invalid mobileNo or password. Please try again.';
          } else if (error.error && error.error.message) {
            // Assuming your backend sends an error message in the response body
            errorMessage = error.error.message;
          } else if (error.statusText) {
            errorMessage = `Login failed: ${error.statusText}`;
          }
        }
        // Emit false for authentication status on error
        this._isAuthenticated.next(false);
        console.error('Login error:', errorMessage);
        // Re-throw the error so components can handle it
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Simulates a registration API call.
   * @returns An Observable of RegisterResponse or an error.
   * @param user
   */
  register(user:any): Observable<RegisterResponse> {

    // Define the endpoint for registration
    const registerEndpoint = `${environment.apiBaseUrl}/register`;

    // Set HTTP headers, specifying content type as JSON
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Make the HTTP POST request to the backend
    return this.http.post<RegisterResponse>(registerEndpoint, user, { headers }).pipe(
      tap((response: RegisterResponse) => {
        console.log('Registration successful:', response.message);
        window.location.href = '/login';
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle errors from the backend API call
        let errorMessage = 'An unknown error occurred during registration.';
        if (error.error instanceof ErrorEvent) {
          // Client-side or network error
          errorMessage = `Network Error: ${error.error.message}`;
        } else {
          // Backend returned an unsuccessful response code
          console.error(`Backend returned code ${error.status}, body was: `, error.error);
          if (error.status === 400) {
            errorMessage = 'Invalid input. Please check your details and try again.';
          } else if (error.error && error.error.message) {
            // Assuming your backend sends an error message in the response body
            errorMessage = error.error.message;
          } else if (error.statusText) {
            errorMessage = `Registration failed: ${error.statusText}`;
          }
        }
        console.error('Registration error:', errorMessage);
        // Re-throw the error so components can handle it
        return throwError(() => new Error(errorMessage));
      })
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
          return payload.lastName || 'Guest'; // Return userName or 'Guest' if not available
        } catch (e) {
          console.error('Error parsing token:', e);
          return 'Guest';
        }
      }
    }
    return 'Guest'; // Default if no token or not in browser
  }
}
