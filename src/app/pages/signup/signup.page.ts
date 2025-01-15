import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonIcon, IonFab, IonFabButton, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonButton, IonFabButton, IonFab, IonIcon, IonInput, IonItem, RouterModule, IonContent, IonTitle, CommonModule, FormsModule]
})
export class SignupPage {
  email: string = '';
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  signup() {
    this.authService.signup(this.email, this.username, this.password).subscribe(response => {
      console.log(response);
    }, (error: any) => {
      console.error('Signup error:', error);
      if (error.status === 500) {
        console.error('Internal Server Error:', error.message);
      } else {
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
      }
    });
  }
}