import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Router, RouterLink } from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {AppComponent} from '../app.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html', // Referencing external HTML file
  styleUrls: ['./login.component.css'] // You can keep this for specific login styles
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  private authService = inject(AuthService);
  private router = inject(Router);
  private appComponent = inject(AppComponent);

  onSubmit() {
    this.loading = true;
    this.appComponent.setMessage('');

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.appComponent.setMessage(response.message || 'Login successful!');
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.appComponent.setMessage(error.message || 'Login failed. Please check your credentials.');
        console.error('Login error:', error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
