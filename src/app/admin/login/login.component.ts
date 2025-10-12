import {Component, ElementRef, inject, OnInit, QueryList, ViewChildren} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../../../environments/environment';
import {AlertService} from '../../common-service/alert.service';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class AdminLoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  otp: string = '';
  resendDisabled = true;
  countdown = environment.otpExpiryTimeInMin * 60;
  maxCountdown = environment.otpExpiryTimeInMin * 60;
  private countdownInterval: any;

  private authService = inject(AuthService);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private alertService = inject(AlertService);

  // @ViewChildren('otp1, otp2, otp3, otp4, otp5, otp6') otpInputs!: ElementRef[];
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;


  ngOnInit(): void {
    this.loginForm = new FormGroup({
      name: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required)
    });
  }

  onSubmit(modal: any): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.loading = true;
      const { name, phoneNumber } = this.loginForm.value;

      this.authService.login(name, phoneNumber).subscribe({
        next: () => {
          this.startCountdown();
          this.modalService.open(modal, {
            size: 'md',
            backdrop: 'static',
            centered: true,
            keyboard: false
          });
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Login failed. Please try again.';
          this.alertService.error('Error', this.errorMessage as any);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  verifyOTP(): void {
    const phoneNumber = this.loginForm.value.phoneNumber;
    if (this.otp.length === 6) {
      this.authService.verifyOtp(phoneNumber, this.otp).subscribe({
        next: (response: any) => {
          localStorage.setItem('authToken', response.token);
          this.alertService.success('Login Successful', `Welcome ${response.name}`);
          this.modalService.dismissAll();
          this.router.navigate(['/admin/create-product']);
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'OTP verification failed.';
          this.alertService.error('Error', this.errorMessage as any);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  onOtpChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    this.otpInputs.toArray()[index].nativeElement.value = input.value;

    this.otp = this.otpInputs.toArray().map(el => el.nativeElement.value).join('');

    // Focus next input if available
    const nextInput = this.otpInputs.toArray()[index + 1];
    if (input.value && nextInput) {
      nextInput.nativeElement.focus();
    }
  }


  resendOTP(): void {
    this.resendDisabled = true;
    this.countdown = this.maxCountdown;
    this.startCountdown();
    // Optionally re-trigger loginAdmin to resend OTP
    const { name, phoneNumber } = this.loginForm.value;
    this.authService.login(name, phoneNumber).subscribe();
  }

  startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.resendDisabled = false;
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.valid && (field.touched || field.dirty));
  }

}
