import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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

    this.authService.login(this.username, this.password).subscribe({
      next: async (response) => {
        console.log(response);
        this.router.navigate(['/home']);
      },
      error: async (error) => {
        console.error(error);
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: 'Username or password incorrect.',
          buttons: ['OK']
        });
        await alert.present();
      },
      complete: () => {
        console.log('Login request complete.');
      }
    });
  }
}