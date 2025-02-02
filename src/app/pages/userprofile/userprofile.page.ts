import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonContent, IonItem, IonLabel, IonButton, IonThumbnail, IonTitle, IonToolbar, IonHeader } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.page.html',
  styleUrls: ['./userprofile.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonButton, IonItem, IonLabel, IonContent, IonThumbnail, CommonModule, FormsModule]
})
export class UserprofilePage implements OnInit {
  userId: string = '';
  username: string = '';
  email: string = '';
  selectedPicture: string = 'assets/mario.png';
  pictures: string[] = ['assets/mario.png', 'assets/kirby.png', 'assets/garfield.png'];
  currentPictureIndex: number = 0;
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId') || '';
    this.username = localStorage.getItem('username') || '';
    this.email = localStorage.getItem('email') || '';
    this.currentPictureIndex = parseInt(localStorage.getItem('picture') || '0', 10);
    this.selectedPicture = this.pictures[this.currentPictureIndex];

    if (!this.userId || !this.username || !this.email) {
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
        this.currentPictureIndex = response.user.picture - 1;
        this.selectedPicture = this.pictures[this.currentPictureIndex];
      }, error => {
        console.error('Fehler beim Abrufen der Benutzerdaten:', error);
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  togglePicture() {
    this.currentPictureIndex = (this.currentPictureIndex + 1) % this.pictures.length;
    this.selectedPicture = this.pictures[this.currentPictureIndex];

    // Aktualisieren des Bildes in der Datenbank
    this.http.post('http://localhost:3000/update-picture', { userId: this.userId, picture: this.currentPictureIndex + 1 })
      .subscribe(response => {
        localStorage.setItem('picture', (this.currentPictureIndex + 1).toString());
      }, error => {
        console.error('Fehler beim Aktualisieren des Profilbildes:', error);
      });
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('picture');
    this.authService.logout();
    this.router.navigate(['/landing']);
  }
  
  
  home() {
    this.router.navigate(['/home']);
  }
}

