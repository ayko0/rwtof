import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonIcon, IonFab, IonFabButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, IonIcon, IonInput, IonItem, RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SignupPage {
  email = '';
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const data = {
      email: this.email,
      username: this.username,
      password: this.password,
    };

    this.authService.signUp(data).subscribe({
      next: (response) => {
        console.log('Erfolgreich registriert:', response);
        alert('Registrierung erfolgreich!');
        this.router.navigate(['/login']); // Nach Registrierung zur Login-Seite weiterleiten
      },
      error: (error) => {
        console.error('Registrierung fehlgeschlagen:', error);
        alert('Registrierung fehlgeschlagen.');
      },
    });
  }
}
