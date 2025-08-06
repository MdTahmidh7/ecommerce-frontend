import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './auth/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'ecommerce-frontend';
  currentYear = new Date().getFullYear();
  message: string | null = null;
  showNavbar = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showNavbar = !event.urlAfterRedirects.includes('/admin/login');
    });
  }

  setMessage(msg: string) {
    this.message = msg;
  }

  clearMessage() {
    this.message = null;
  }

}
