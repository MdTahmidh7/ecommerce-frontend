// src/app/auth/login/login.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // For NgIf, NgClass
import {ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl} from '@angular/forms'; // For Reactive Forms
import { Router, RouterLink } from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {AppComponent} from '../app.component'; // For navigation


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Crucial for [formGroup] and formControlName
    RouterLink // For routerLink in the template
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Make sure you have this CSS file
})
export class LoginComponent implements OnInit {
  // Reactive Form Group for login credentials
  loginForm!: FormGroup;

  // UI state variables
  loading: boolean = false; // Controls loading spinner and button disabled state
  showPassword: boolean = false; // Toggles password visibility
  successMessage: string | null = null; // Displays success alerts
  errorMessage: string | null = null; // Displays error alerts

  // Injected services
  private authService = inject(AuthService);
  private router = inject(Router);
  private appComponent = inject(AppComponent); // For global alerts (if needed, otherwise remove)

  ngOnInit(): void {
    // Initialize the login form with FormControls and Validators
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      rememberMe: new FormControl(false) // For the "Remember me" checkbox
    });
  }

  /**
   * Helper function to check if a form field is invalid and has been touched/modified.
   * Ensures the control exists before accessing its properties.
   * @param fieldName The name of the form control (e.g., 'email', 'password').
   * @returns boolean
   */
  isFieldInvalid(fieldName: string): boolean {
    const field: AbstractControl | null = this.loginForm.get(fieldName);
    // Explicitly check if 'field' is not null, then check its properties
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  /**
   * Helper function to check if a form field is valid and has been touched/modified.
   * Ensures the control exists before accessing its properties.
   * @param fieldName The name of the form control.
   * @returns boolean
   */
  isFieldValid(fieldName: string): boolean {
    const field: AbstractControl | null = this.loginForm.get(fieldName);
    // Explicitly check if 'field' is not null, then check its properties
    return !!(field && field.valid && (field.touched || field.dirty));
  }

  /**
   * Toggles the visibility of the password input field.
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Handles the form submission.
   * Validates the form and calls the AuthService for login.
   */
  onSubmit(): void {
    // Mark all fields as touched to trigger validation messages immediately
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      this.loading = true; // Show loading spinner
      this.successMessage = null; // Clear previous messages
      this.errorMessage = null;

      const { email, password, rememberMe } = this.loginForm.value;

      // Call the authentication service
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.successMessage = response.message; // Display success message locally
          this.appComponent.setMessage(response.message); // Also send to global message system
          console.log('Login successful:', response);
          // Navigate to home page or dashboard after successful login
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.errorMessage = error.message || 'An unexpected error occurred during login.'; // Display error message locally
          //this.appComponent.setMessage(this.errorMessage); // Also send to global message system
          console.error('Login error:', error);
          // Optional: Clear password field on error
          this.loginForm.get('password')?.reset();
        },
        complete: () => {
          this.loading = false; // Hide loading spinner regardless of success/error
        }
      });
    } else {
      // If form is invalid, show a generic error or rely on field-specific errors
      this.errorMessage = 'Please correct the errors in the form.';
      this.appComponent.setMessage(this.errorMessage);
    }
  }

  /**
   * Placeholder method for "Forgot Password" functionality.
   * @param event The click event to prevent default navigation.
   */
  forgotPassword(event: Event): void {
    event.preventDefault(); // Prevent default link behavior
    this.appComponent.setMessage('Forgot password functionality not yet implemented.');
    console.log('Forgot Password clicked!');
    // Implement navigation to forgot password page or open a modal
  }

  /**
   * Placeholder method for "Login with Google" functionality.
   */
  loginWithGoogle(): void {
    if (this.loading) return;
    this.loading = true;
    this.appComponent.setMessage('Attempting to log in with Google...');
    console.log('Login with Google clicked!');
    // Implement Google OAuth logic here
    setTimeout(() => {
      this.loading = false;
      this.appComponent.setMessage('Google login not implemented yet!');
    }, 2000);
  }

  /**
   * Placeholder method for "Login with Facebook" functionality.
   */
  loginWithFacebook(): void {
    if (this.loading) return;
    this.loading = true;
    this.appComponent.setMessage('Attempting to log in with Facebook...');
    console.log('Login with Facebook clicked!');
    // Implement Facebook OAuth logic here
    setTimeout(() => {
      this.loading = false;
      this.appComponent.setMessage('Facebook login not implemented yet!');
    }, 2000);
  }
}
