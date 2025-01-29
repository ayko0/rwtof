import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonSelect, IonSelectOption, IonInput } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';  // Hinzugefügt

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonSelect, IonSelectOption, IonInput, CommonModule, FormsModule]
})
export class TrackingPage implements OnInit {

  mediaList: any[] = [];
  selectedMedium = '';
  progress = 0;

  constructor(private http: HttpClient) { }  // Angepasst

  ngOnInit() {
    this.loadMediaList();
  }

  loadMediaList() {
    this.http.get<any[]>('http://localhost:3000/media').subscribe(data => {  // Angepasst
      this.mediaList = data;
    }, error => {
      console.error('Fehler beim Abrufen der Media-Liste:', error);
    });
  }

  saveGoals() {
    const goal = {
      mediaID: this.selectedMedium,
      userID: 1,  // Beispiel: Aktuelle Benutzer-ID
      goal_type: 'Reading/Watching',
      goal_description: `${this.progress} pro Woche`,
      progress: this.progress
    };
    this.http.post('http://localhost:3000/media-tracking', goal).subscribe(() => {  // Angepasst
      console.log('Goals saved!');
    }, error => {
      console.error('Fehler beim Speichern der Ziele:', error);
    });
  }

}
