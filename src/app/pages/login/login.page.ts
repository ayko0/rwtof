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

  constructor(private authService: AuthService, private router: Router, private alertController: AlertController) {}

  async login() {
    if (!this.username || !this.password) {
      const alert = await this.alertController.create({
        header: 'Login failed',
        message: 'Please enter both username and password.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.authService.login(this.username, this.password).subscribe(
      async response => {
        console.log(response);
        // Weiterleitung nach erfolgreichem Login
        await this.router.navigate(['/home']);
      },
      async error => {
        console.error('Login error:', error);
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: 'Invalid username or password.',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }
}