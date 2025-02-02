import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonSelect, IonSelectOption, CommonModule, FormsModule]
})
export class TrackingPage implements OnInit {

  mediaList: any[] = [];
  genres: any[] = [
    { id: 1, name: 'Fantasy', type: 1 },
    { id: 2, name: 'Science-Fiction', type: 1 },
    { id: 3, name: 'Krimi', type: 1 },
    { id: 4, name: 'Historischer Roman', type: 1 },
    { id: 5, name: 'Horror', type: 1 },
    { id: 6, name: 'Abenteuer', type: 1 },
    { id: 7, name: 'Liebesroman', type: 1 },
    { id: 8, name: 'Drama', type: 2 },
    { id: 9, name: 'Komödie', type: 2 },
    { id: 10, name: 'Thriller', type: 2 },
    { id: 11, name: 'Mystery', type: 2 },
    { id: 12, name: 'Dokumentation', type: 2 },
    { id: 13, name: 'Animation', type: 2 },
    { id: 14, name: 'Reality-TV', type: 2 },
    { id: 15, name: 'Action', type: 3 },
    { id: 16, name: 'Abenteuer', type: 3 },
    { id: 17, name: 'Komödie', type: 3 },
    { id: 18, name: 'Drama', type: 3 },
    { id: 19, name: 'Horror', type: 3 },
    { id: 20, name: 'Musical', type: 3 },
    { id: 21, name: 'Science-Fiction', type: 3 }
  ];
  filteredMediaList: any[] = [];
  availableGenres: any[] = [];
  selectedType: number | null = null;
  selectedGenre: number | null = null;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {}

  onTypeChange(event: any) {
    this.selectedType = event.detail.value;
    this.availableGenres = this.genres.filter(genre => genre.type === this.selectedType);
    this.selectedGenre = null;
    this.filteredMediaList = [];
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.loadMediaList();
  }

  loadMediaList() {
    const params: any = { type: this.selectedType };
    if (this.selectedGenre) {
      params.genre = this.selectedGenre;
    }
    this.http.get<any[]>('http://localhost:3000/tbl_media', { params })
      .subscribe(data => {
        this.filteredMediaList = data.map(entry => ({
          imgURL: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(new Blob([entry.img], { type: 'image/png' }))),
          name: entry.name,
          mediaID: entry.mediaID
        }));
      }, error => {
        console.error('Fehler beim Laden der Einträge:', error);
      });
  }

  trackMedia(mediaID: number) {
    const trackData = {
      mediaID,
      userID: 1, // Beispiel User-ID
      type: this.selectedType,
      genre: this.selectedGenre,
      finished: 0, // Standardwert für unfertig
      comments: ''
    };

    this.http.post('http://localhost:3000/tbl_tracked', trackData)
      .subscribe(response => {
        console.log('Medium erfolgreich getrackt:', response);
      }, error => {
        console.error('Fehler beim Tracken des Mediums:', error);
      });
  }
}

