import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // For NgIf, NgClass
import {ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, FormsModule} from '@angular/forms'; // For Reactive Forms
import { Router, RouterLink } from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {AppComponent} from '../app.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {verify} from 'node:crypto'; // For navigation


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Crucial for [formGroup] and formControlName
    RouterLink,
    FormsModule,
    // For routerLink in the template
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
  otp: number | null = null;
  resendDisabled: boolean = true;

  constructor(
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // Initialize the login form with FormControls and Validators
    this.loginForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      phoneNo: new FormControl('', [Validators.required]),
      rememberMe: new FormControl(false) // For the "Remember me" checkbox
    });
  }


  isFieldInvalid(fieldName: string): boolean {
    const field: AbstractControl | null = this.loginForm.get(fieldName);
    // Explicitly check if 'field' is not null, then check its properties
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  isFieldValid(fieldName: string): boolean {
    const field: AbstractControl | null = this.loginForm.get(fieldName);
    // Explicitly check if 'field' is not null, then check its properties
    return !!(field && field.valid && (field.touched || field.dirty));
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }


  onSubmit(modal: any): void {
    // Mark all fields as touched to trigger validation messages immediately
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {

      this.loading = true; // Show loading spinner
      this.successMessage = null; // Clear previous messages
      this.errorMessage = null;

      const {name, phoneNo, rememberMe} = this.loginForm.value;

      // Call the authentication service
      this.authService.login(name, phoneNo).subscribe({
        next: (response) => {
          // Handle successful login
        },
        error: (error) => {
          this.errorMessage = error.message || 'An unexpected error occurred during login.';
          console.error('Login error:', error);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });

      //open modal for otp verification
      const modalRef = this.modalService.open(modal, {
        size: 'md',
        backdrop: 'static',
        centered: true,
        keyboard: false
      });

      modalRef.result.then(
        (result) => {
          console.log('Form submitted successfully:', result);
        },
        (dismissed) => {
          console.log('Modal dismissed:', dismissed);
        }
      );
    } else {
      this.errorMessage = 'Please correct the errors in the form.';
      this.appComponent.setMessage(this.errorMessage);
    }
  }


  forgotPassword(event: Event): void {
    event.preventDefault(); // Prevent default link behavior
    this.appComponent.setMessage('Forgot password functionality not yet implemented.');
    console.log('Forgot Password clicked!');
  }


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

  verifyOTP(modal:any): void {

    if (this.otp != null) {
      this.authService.verifyOtp(this.loginForm.value.phoneNo, this.otp.toString()).subscribe({
        next: (response) => {
          this.successMessage = 'OTP verified successfully! Redirecting...';
          this.errorMessage = null;
          // Navigate to dashboard or intended page
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.message || 'OTP verification failed. Please try again.';
          this.successMessage = null;
          console.error('OTP Verification error:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }

  }

  resendOTP() {
    // Logic to resend OTP
    this.loading = true;
    this.authService.reSendOtp(this.loginForm.value.phoneNo).subscribe({
      next: (response) => {
        this.successMessage = 'OTP resent successfully! Please check your phone.';
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to resend OTP. Please try again later.';
        this.successMessage = null;
        console.error('Resend OTP error:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });

  }
}
