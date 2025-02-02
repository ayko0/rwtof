import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonTextarea, IonToggle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-edittracking',
  templateUrl: './edittracking.page.html',
  styleUrls: ['./edittracking.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonTextarea, IonToggle, CommonModule, FormsModule]
})
export class EdittrackingPage implements OnInit {
  trackings: any[] = [];
  userID: number = 16; // Beispiel User-ID 16

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadTrackings();
  }

  loadTrackings() {
    this.http.get<any[]>(`http://localhost:3000/user-trackings/${this.userID}`)
      .subscribe(data => {
        this.trackings = data;
      }, error => {
        console.error('Fehler beim Laden der Trackings:', error);
      });
  }

  updateTracking(tracking: any) {
    const updatedTracking = {
      comments: tracking.comments,
      finished: tracking.finished ? 1 : 0 // 0/1 für finished
    };

    this.http.put(`http://localhost:3000/tbl_tracked/${tracking.id}`, updatedTracking)
      .subscribe(response => {
        console.log('Tracking erfolgreich aktualisiert:', response);
      }, error => {
        console.error('Fehler beim Aktualisieren des Trackings:', error);
      });
  }
}

