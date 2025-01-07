import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
//import { IonicModule } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonImg, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: true,
  imports: [HttpClientModule, RouterModule, IonIcon, IonFabButton, IonFab, IonImg, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LandingPage {
  email = '';
  username = '';
  password = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    const data = { email: this.email, username: this.username, password: this.password };

    this.authService.signUp(data).subscribe({
      next: (response) => {
        console.log('Erfolgreich registriert:', response);
        alert('Registrierung erfolgreich!');
      },
      error: (error) => {
        console.error('Fehler:', error);
        alert('Registrierung fehlgeschlagen.');
      },
    });
  }
}