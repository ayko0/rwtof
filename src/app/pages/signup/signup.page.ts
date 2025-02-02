import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonInput, IonItem, RouterModule, IonContent, IonHeader, IonTitle, CommonModule, FormsModule]
})
export class SignupPage {
  email: string = '';
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  signup() {
    const signupData = {
      email: this.email,
      username: this.username,
      password: this.password
    };

    this.authService.signup(signupData).subscribe(response => {
      console.log(response);
      this.router.navigate(['/login']);
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
