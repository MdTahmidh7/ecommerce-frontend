import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './auth/auth.service'; // Keep AuthService for message handling if needed

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  templateUrl: './app.component.html', // Now referencing an external HTML file
  styleUrls: ['./app.component.css'] // You can keep this for specific global app styles
})
export class AppComponent implements OnInit {

  title = 'ecommerce-frontend';
  currentYear = new Date().getFullYear();
  message: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // No direct isAuthenticated check here; NavbarComponent handles it via AuthService subscription
  }

  setMessage(msg: string) {
    this.message = msg;
  }

  clearMessage() {
    this.message = null;
  }

}
