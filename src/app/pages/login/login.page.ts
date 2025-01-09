import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonIcon, IonFab, IonFabButton, IonButton } from '@ionic/angular/standalone';

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
    this.authService.login(this.username, this.password).subscribe(
      async (response) => {
        console.log(response);
        this.router.navigate(['/home']);
      },
      async (error) => {
        console.error(error);
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: 'Username or password incorrect.',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }
}

