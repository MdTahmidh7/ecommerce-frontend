import {Component, ElementRef, inject, OnInit, QueryList, ViewChildren} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {UserRegistrationRequest} from '../model/userRegistrationRequest.model';
import {DivisionModel} from '../model/division.model';
import {DistrictsModel} from '../model/districts.model';
import {UpazilaModel} from '../model/upazila.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertService} from '../common-service/alert.service';
import {RegisterService} from './register.service';
import {environment} from '../../environments/environment'; // Import AppComponent to access setMessage

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html', // Referencing external HTML file
  styleUrls: ['./register.component.css'] // You can keep this for specific register styles
})
export class RegisterComponent implements OnInit{

  password = '';
  loading = false;
  user: UserRegistrationRequest = null as any;
  isSubmitting: boolean = false;

  divisions:DivisionModel[] = [];
  districts:DistrictsModel[] = [];
  upazilas:UpazilaModel[] = [];

  otp: string = '';
  resendDisabled: boolean = true;
  countdown: number = environment.otpExpiryTimeInMin*60;
  maxCountdown: number = environment.otpExpiryTimeInMin*60;
  private countdownInterval: any;
  // Use ViewChildren to access the OTP input elements
  @ViewChildren('otp1, otp2, otp3, otp4, otp5, otp6') otpInputs!: ElementRef[];
  errorMessage: string | null = null;

  private authService = inject(AuthService);
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private alertService: AlertService,
    private registerService: RegisterService
  ) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      districtName: ['', Validators.required],
      upazilaName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Fetch divisions on component initialization
    //this.getAllDivisions();
  }

  onSubmit( verifyOtpModal: any): void {

    if (this.registrationForm.valid) {
      console.log("Form values for user registration = ", this.registrationForm.value)
      this.user = {
        name: this.registrationForm.value.name,
        phoneNumber: this.registrationForm.value.phoneNumber,
        address: this.registrationForm.value.address,
        upazilaId: this.registrationForm.value.upazilaId,
        districtName: this.registrationForm.value.districtName,
        upazilaName: this.registrationForm.value.upazilaName
      };

      //call register API
      this.authService.register(this.user).subscribe({
        next: (response) => {
          this.startCountdown();
          console.log('Contact registered successfully:', response);
          this.errorMessage = null;
          const modalRef = this.modalService.open(verifyOtpModal, {
            size: 'md',
            backdrop: 'static',
            centered: true,
            keyboard: false
          });
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
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registrationForm.controls).forEach(key => {
        this.registrationForm.get(key)?.markAsTouched();
      });
    }
  }

  verifyOTP(modal: any) {
    if (this.otp != null) {

      this.authService.verifyOtp(
        this.registrationForm.value.phoneNumber,
        this.otp.toString()
      ).subscribe({
        next: (response) => {
          this.modalService.dismissAll();
          this.alertService.success('Login Successful','Welcome back.');
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = error.message || 'OTP verification failed. Please try again.';
          console.error('OTP Verification error:', error);
        },
        complete: () => {
          //this.loading = false;
        }
      });
    }
  }

  resendOTP() {
    //handle resend otp
  }

  onOtpChange(event: KeyboardEvent, nextInput: HTMLInputElement | null, prevInput: HTMLInputElement | null) {
    const input = event.target as HTMLInputElement;

    // Move backward on backspace
    if (event.key === 'Backspace' && input.value === '') {
      if (prevInput) {
        prevInput.focus();
      }
    }
    // Move forward on digit entry
    else if (event.key >= '0' && event.key <= '9') {
      if (nextInput) {
        nextInput.focus();
      }
    }
    // Update the final OTP string after the input changes
    this.updateOtpString();
  }

  // A helper method to combine all input values into a single string
  updateOtpString() {
    this.otp = this.otpInputs.map(input => input.nativeElement.value).join('');
    // You can now check this.otp.length here to disable/enable the button
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

  public isFieldInvalid(field: string) {
    const control = this.registrationForm.get(field);
    return control && control.invalid && (control.dirty || control.touched);
  }

  private getAllDivisions() {
    this.registerService.getAllDivisions().subscribe({
      next: (data: any) => {
        this.divisions = data.content || [];
        console.log('Divisions fetched successfully:', this.divisions);
      },
      error: (error: any) => {
        console.error('Error fetching divisions:', error);
      }
    });
  }

  onDivisionChange(event: Event) {
    this.registrationForm.get('upazilaId')?.disable();
    const divisionId = (event.target as HTMLSelectElement).value;
    if (!divisionId) {
      this.districts = [];
      this.upazilas = [];
      return;
    }
    this.registerService.getAllDistrictByDivisionId(divisionId).subscribe({
      next: (data: any) => {
        this.districts = data.content || [];
        this.upazilas = [];
        this.registrationForm.patchValue({ district: '', upazila: '' });
      },
      error: (error: any) => {
        console.error('Error fetching districts:', error);
      }
    });
  }

  onDistrictChange(event: Event) {
    const districtId = (event.target as HTMLSelectElement).value;
    console.log('Selected District ID:', districtId);
    if (!districtId) {
      this.upazilas = [];
      this.registrationForm.patchValue({ upazila: '' });
      return;
    }
    this.registerService.getAllUpazilaByDistrictId(districtId).subscribe({
      next: (data: any) => {
        this.upazilas = data.content || [];
        this.registrationForm.patchValue({ upazila: '' });
        // Enable the upazila select field
        this.registrationForm.get('upazilaId')?.enable();
      },
      error: (error: any) => {
        console.error('Error fetching upazilas:', error);
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
