import { Component, OnInit, OnDestroy, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AuthService, AuthService as UserAuthService} from '../auth/auth.service';
import { AuthService as AdminAuthService } from '../admin/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  private authSubscription: Subscription | null = null;
  private userAuthService = inject(UserAuthService);
  private authService = inject(AuthService);
  private router = inject(Router);
  userName: string = '';

  @Output() messageEvent = new EventEmitter<string>();

  ngOnInit(): void {
    this.authSubscription = this.userAuthService
      .isAuthenticated$
      .subscribe(status => {
        this.isAuthenticated = status;
        if (status) {
          this.userName = this.userAuthService.getUserName();
        } else {
          this.userName = 'Guest';
        }
      });
    this.isAdmin = this.authService.isAdminUser();
    console.log(`Navbar initialized. isAdmin: ${this.isAdmin}`);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout() {
    if (this.isAdmin) {
      this.authService.logoutAdmin();
      this.router.navigate(['/admin/login']);
    } else {
      this.userAuthService.logout();
      this.messageEvent.emit('Logged out successfully.');
      this.router.navigate(['/login']);
    }
  }

  closeNavbar() {
    //close navbar on click
    const navbarToggler = document.querySelector('.navbar-toggler') as HTMLElement;
    if (navbarToggler && getComputedStyle(navbarToggler).display !== 'none') {
      navbarToggler.click();
    }
  }
}
