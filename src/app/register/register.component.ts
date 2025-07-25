import { Component, inject } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AppComponent } from '../app.component';
import {AuthService} from '../auth/auth.service';
import {UserRegistrationRequest} from '../model/userRegistrationRequest.model';
import {DivisionModel} from '../model/division.model';
import {DistrictsModel} from '../model/districts.model';
import {UpazilaModel} from '../model/upazila.model';
import {RegisterService} from './register.service'; // Import AppComponent to access setMessage

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html', // Referencing external HTML file
  styleUrls: ['./register.component.css'] // You can keep this for specific register styles
})
export class RegisterComponent {

  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  user: UserRegistrationRequest = null as any;
  userRegistrationForm : FormGroup = new FormGroup({});
  isSubmitting: boolean = false;
  showPassword = false;

  divisions:DivisionModel[] = [];
  districts:DistrictsModel[] = [];
  upazilas:UpazilaModel[] = [];

  private authService = inject(AuthService);
  private appComponent = inject(AppComponent);

  constructor(private fb: FormBuilder,
              private registerService: RegisterService,
              private router: Router
  ) {
    this.userRegistrationForm = this.fb.group(
      {
        phoneNumber: ['', [Validators.required, Validators.maxLength(20)]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
        confirmPassword: ['', Validators.required],
        firstName: [''],
        lastName: [''],
        address: ['', Validators.maxLength(500)],
        upazilaId: [null, Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  get f() {
    return this.userRegistrationForm.controls as {
      phoneNumber: AbstractControl;
      password: AbstractControl;
      confirmPassword: AbstractControl;
      firstName: AbstractControl;
      lastName: AbstractControl;
      address: AbstractControl;
      upazilaId: AbstractControl;
    };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit() {

    console.log("In onSubmit method of register component");
    if (this.password !== this.confirmPassword) {
      this.appComponent.setMessage('Passwords do not match.');
      return;
    }

    this.loading = true;
    this.appComponent.setMessage('');

    console.log('Form Values:', this.userRegistrationForm.value);

    this.authService.register(this.userRegistrationForm.value).subscribe({

      next: (response) => {
       //redirect to login page after successful registration
        console.log("response from register api", response);
        console.log("registration successful, redirecting to login page");
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.appComponent.setMessage(error.message || 'Registration failed. Please try again.');
        console.error('Registration error:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }



  onDivisionChange(event: Event) {

    const divisionId = (event.target as HTMLSelectElement).value;

    if (!divisionId) {
      this.districts = [];
      this.upazilas = [];
      this.userRegistrationForm.patchValue({ district: '', upazila: '' });
      return;
    }
    this.registerService.getAllDistrictByDivisionId(divisionId).subscribe({
      next: (data: any) => {
        this.districts = data.content || [];
        this.upazilas = [];
        this.userRegistrationForm.patchValue({ district: '', upazila: '' });
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
      this.userRegistrationForm.patchValue({ upazila: '' });
      return;
    }
    this.registerService.getAllUpazilaByDistrictId(districtId).subscribe({
      next: (data: any) => {
        this.upazilas = data.content || [];
        this.userRegistrationForm.patchValue({ upazila: '' });
      },
      error: (error: any) => {
        console.error('Error fetching upazilas:', error);
      }
    });
  }

}
