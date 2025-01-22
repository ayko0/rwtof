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
  username: string = '';
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    this.loadProfile();
  }
  loadProfile() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.authService.getProfile(Number(userId)).subscribe(response => {
        this.username = response.user.username;
      }, error => {
        console.error('Fehler beim Abrufen der Benutzerdaten:', error);
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
  logout() {
    localStorage.removeItem('userId');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
