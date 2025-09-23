import {Component, ElementRef, inject, OnInit, ViewChildren} from '@angular/core';
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
import {RegisterService} from './register.service'; // Import AppComponent to access setMessage

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
  resendDisabled: boolean = false;
  countdown: number = 60;
  private countdownInterval: any;
  // Use ViewChildren to access the OTP input elements
  @ViewChildren('otp1, otp2, otp3, otp4, otp5, otp6') otpInputs!: ElementRef[];
  errorMessage: string | null = null;

  private authService = inject(AuthService);
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private alertService: AlertService,
    private registerService: RegisterService
  ) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      upazilaId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Fetch divisions on component initialization
    this.getAllDivisions();
  }

  onSubmit( verifyOtpModal: any): void {

    if (this.contactForm.valid) {
      console.log("Form values for user registration = ", this.contactForm.value)
      this.user = {
        firstName: this.contactForm.value.firstName,
        lastName: this.contactForm.value.lastName,
        password: this.contactForm.value.password,
        phoneNumber: this.contactForm.value.phoneNumber,
        address: this.contactForm.value.address,
        upazilaId: this.contactForm.value.upazilaId
      };

      //call register API
      this.authService.register(this.user).subscribe({
        next: (response) => {
          console.log('Contact registered successfully:', response);
          const modalRef = this.modalService.open(verifyOtpModal, {
            size: 'md',
            backdrop: 'static',
            centered: true,
            keyboard: false
          });
        },
        error: (error) => {
          console.error('Error registering contact:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  verifyOTP(modal: any) {
    if (this.otp != null) {
      console.log("Form values for user registration = ", this.contactForm.value)
      console.log("Phone Number: ", this.contactForm.value.phoneNumber);
      console.log("OTP: ", this.otp);

      this.authService.verifyOtp(
        this.contactForm.value.phoneNumber,
        this.otp.toString()
      ).subscribe({
        next: (response) => {
          this.modalService.dismissAll();
          this.alertService.success('Login Successful','Welcome back.');
          // Handle successful OTP verification
          console.log('OTP verified successfully:', response);
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

  onOtpChange(currentInput: HTMLInputElement, nextInput: HTMLInputElement | null) {
    this.otp = this.otpInputs.map(input => input.nativeElement.value).join('');

    if (currentInput.value && nextInput) {
      nextInput.focus();
    }
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

  isFieldInvalid(field: string) {
    const control = this.contactForm.get(field);
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
    const divisionId = (event.target as HTMLSelectElement).value;
    if (!divisionId) {
      this.districts = [];
      this.upazilas = [];
      this.contactForm.patchValue({ district: '', upazila: '' });
      return;
    }
    this.registerService.getAllDistrictByDivisionId(divisionId).subscribe({
      next: (data: any) => {
        this.districts = data.content || [];
        this.upazilas = [];
        this.contactForm.patchValue({ district: '', upazila: '' });
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
      this.contactForm.patchValue({ upazila: '' });
      return;
    }
    this.registerService.getAllUpazilaByDistrictId(districtId).subscribe({
      next: (data: any) => {
        this.upazilas = data.content || [];
        this.contactForm.patchValue({ upazila: '' });
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
