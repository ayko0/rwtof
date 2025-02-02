import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-edittracking',
  templateUrl: './edittracking.page.html',
  styleUrls: ['./edittracking.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EdittrackingPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
