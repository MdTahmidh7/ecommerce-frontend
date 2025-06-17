import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html', // Referencing external HTML file
  styleUrls: ['./home.component.css'] // You can keep this for specific home styles
})
export class HomeComponent { }
