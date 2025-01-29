import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.page.html',
  styleUrls: ['./userprofile.page.scss'],
  standalone: true,
  imports: [IonButton, IonItem, IonLabel, IonContent, IonHeader, IonTitle, CommonModule, FormsModule]
})
export class UserprofilePage implements OnInit {
  userId: string='';
  username: string='';
  email: string='';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId') || '';
    this.username = localStorage.getItem('username') || '';
    this.email = localStorage.getItem('email') || '';

    if (!this.userId || !this.username|| !this.email) {
      this.router.navigate(['/login']);
    } else {
      this.loadProfile();
    }
  }

  loadProfile() {
    const userId = Number(this.userId);
    if (userId) {
      this.authService.getProfile(userId).subscribe(response => {
        this.username = response.user.username;
        this.email = response.user.email;
      }, error => {
        console.error('Fehler beim Abrufen der Benutzerdaten:', error);
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    this.authService.logout();
    this.router.navigate(['/landing']);
  }
  home() {
    this.router.navigate(['/home']);
  }
}
