import { Component, OnInit, OnDestroy, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html', // Referencing external HTML file
  styleUrls: ['./navbar.component.css'] // You can keep this for specific navbar styles
})
export class NavbarComponent implements OnInit, OnDestroy {

  isAuthenticated: boolean = false;
  private authSubscription: Subscription | null = null;
  private authService = inject(AuthService);
  private router = inject(Router);
  userName: string = '';

  @Output() messageEvent = new EventEmitter<string>();

  ngOnInit(): void {
    this.authSubscription = this.authService
      .isAuthenticated$
      .subscribe(status => {
        this.isAuthenticated = status;
        if (status) {
          this.userName = this.authService.getUserName();
        } else {
          this.userName = 'Guest';
        }
      });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
    this.messageEvent.emit('Logged out successfully.');
    this.router.navigate(['/login']);
  }
}
