import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.page.html',
  styleUrls: ['./entries.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, CommonModule, FormsModule]
})
export class EntriesPage implements OnInit {

  imgURL: any;
  imageId: number = 1;  // Beispielfestlegung der Bild-ID, die du ändern kannst

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.loadImage();
  }

  loadImage() {
    this.http.get(`http://localhost:3000/tbl_media/${this.imageId}`, { responseType: 'blob' })  // Beispiel-ID: 1, passe dies an
      .subscribe(imageBlob => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imgURL = this.sanitizer.bypassSecurityTrustUrl(e.target.result);  // Sichere URL für die Anzeige
        };
        reader.readAsDataURL(imageBlob);
      }, error => {
        console.error('Fehler beim Laden des Bildes:', error);
      });
  }

  // Funktion zum Ändern der Bild-ID
  onImageIdChange(event: any) {
    this.imageId = event.target.value;
    this.loadImage();
  }
}