import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AppComponent } from '../app.component';
import {AuthService} from '../auth/auth.service'; // Import AppComponent to access setMessage

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html', // Referencing external HTML file
  styleUrls: ['./register.component.css'] // You can keep this for specific register styles
})
export class RegisterComponent {

  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  private authService = inject(AuthService);
  private router = inject(Router);
  private appComponent = inject(AppComponent);

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.appComponent.setMessage('Passwords do not match.');
      return;
    }

    this.loading = true;
    this.appComponent.setMessage('');

    this.authService.register(this.fullName, this.email, this.password).subscribe({
      next: (response) => {
        this.appComponent.setMessage(response.message || 'Registration successful! Please login.');
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
}
