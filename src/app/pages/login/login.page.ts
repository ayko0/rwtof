import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonIcon, IonFab, IonFabButton, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonButton, IonFabButton, IonFab, IonIcon, IonInput, IonItem, RouterModule, IonContent, IonTitle, CommonModule, FormsModule]
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async login() {
    if (!this.username || !this.password) {
      const alert = await this.alertController.create({
        header: 'Login fehlgeschlagen',
        message: 'Bitte Benutzername und Passwort eingeben.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.authService.login({ username: this.username, password: this.password }).subscribe(async (response) => {
      console.log(response);
      // Überprüfen, ob die response.id und response.username vorhanden sind
      if (response && response.id && response.username) {
        localStorage.setItem('userId', response.id.toString());
        localStorage.setItem('username', response.username);
        localStorage.setItem('email', response.email);
        this.router.navigate(['/userprofile']);
      } else {
        console.error('Login-Fehler: Benutzer-ID oder Benutzername nicht gefunden.');
        const alert = await this.alertController.create({
          header: 'Login fehlgeschlagen',
          message: 'Benutzername nicht gefunden.',
          buttons: ['OK']
        });
        await alert.present();
      }
    }, async (error: any) => {
      console.error('Login-Fehler:', error);
      const alert = await this.alertController.create({
        header: 'Login fehlgeschlagen',
        message: error.error.message,
        buttons: ['OK']
      });
      await alert.present();
    });    
  }
}
