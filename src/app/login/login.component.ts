import {Component, ElementRef, inject, OnInit, ViewChildren} from '@angular/core';
import {CommonModule} from '@angular/common'; // For NgIf, NgClass
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms'; // For Reactive Forms
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {AppComponent} from '../app.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertService} from '../common-service/alert.service'; // For navigation


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
  otp: string = '';
  resendDisabled: boolean = false;
  countdown: number = 60;
  private countdownInterval: any;
  // Use ViewChildren to access the OTP input elements
  @ViewChildren('otp1, otp2, otp3, otp4, otp5, otp6') otpInputs!: ElementRef[];

  constructor(
    private modalService: NgbModal,
    private alertService : AlertService
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
        },
        error: (error) => {
          let errorMessage = 'An unexpected error occurred.';
          if (error && error.error) {
            // If the error body is already a JSON object
            if (typeof error.error === 'object' && error.error.message) {
              errorMessage = error.error.message;
            }
            // If the error body is a JSON string, attempt to parse it
            else if (typeof error.error === 'string') {
              try {
                const parsedError = JSON.parse(error.error);
                if (parsedError.message) {
                  errorMessage = parsedError.message;
                }
              } catch (e) {
                console.error('Failed to parse error response:', e);
              }
            }
          }
          this.alertService.error('Error', errorMessage);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
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
          this.modalService.dismissAll();
          this.alertService.success('Login Successful','Welcome back.');
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

  onOtpChange(currentInput: HTMLInputElement, nextInput: HTMLInputElement | null) {
    this.otp = this.otpInputs.map(input => input.nativeElement.value).join('');

    if (currentInput.value && nextInput) {
      nextInput.focus();
    }
  }

  resendOTP() {
    // Logic to resend OTP
    console.log('Resending OTP...');
    this.resendDisabled = true;
    this.countdown = 60; // Reset countdown
    this.startCountdown();
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.resendDisabled = false;
      }
    }, 1000);
  }

  ngOnDestroy() {
    // Clear the interval when the component is destroyed
    clearInterval(this.countdownInterval);
  }
}
