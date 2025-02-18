import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.page.html',
  styleUrls: ['./entries.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, CommonModule, FormsModule]
})
export class EntriesPage implements OnInit {

  media = {
    type: '',
    genre: 0 as number // Ändere den Typ zu Zahl
  };

  entries: any[] = [];
  genres: { [key: string]: { id: number; name: string }[] } = { 
    '1': [{ id: 1, name: 'Fantasy' }, { id: 2, name: 'Science-Fiction' }, { id: 3, name: 'Krimi' }, { id: 4, name: 'Historischer Roman' }, { id: 5, name: 'Horror' }, { id: 6, name: 'Abenteuer' }, { id: 7, name: 'Liebesroman' }],
    '2': [{ id: 8, name: 'Drama' }, { id: 9, name: 'Komödie' }, { id: 10, name: 'Thriller' }, { id: 11, name: 'Mystery' }, { id: 12, name: 'Dokumentation' }, { id: 13, name: 'Animation' }, { id: 14, name: 'Reality-TV' }],
    '3': [{ id: 15, name: 'Action' }, { id: 16, name: 'Abenteuer' }, { id: 17, name: 'Komödie' }, { id: 18, name: 'Drama' }, { id: 19, name: 'Horror' }, { id: 20, name: 'Musical' }, { id: 21, name: 'Science-Fiction' }]
  };

  availableGenres: { id: number; name: string }[] = [];
  selectedType: number | null = null;
  selectedGenre: number | null = null;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {}

  onTypeChange(event: any) {
    const selectedType = event.detail.value;
    if (selectedType) {
      this.availableGenres = this.genres[selectedType];
      this.media.genre = 0;  // Initialisiere Genre als Integer
    } else {
      this.availableGenres = [];
      this.media.genre = 0;  // Initialisiere Genre als Integer
    }
  }

  loadEntries() {
    const params: any = { type: this.media.type, genre: this.media.genre };
    this.http.get<any[]>('http://localhost:3000/tbl_media', { params })
      .subscribe(data => {
        this.entries = data.map(entry => ({
          imgURL: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(new Blob([new Uint8Array(entry.img.data)], { type: 'image/png' }))),
          name: entry.name
        }));
      }, error => {
        console.error('Fehler beim Laden der Einträge:', error);
      });
  }
}




