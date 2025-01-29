import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-entry',
  templateUrl: './new-entry.page.html',
  styleUrls: ['./new-entry.page.scss'],
  standalone: true,
  imports: [RouterModule, IonButton, IonInput, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, CommonModule, FormsModule]
})
export class NewEntryPage implements OnInit {

  media = {
    name: '',
    type: '',
    genre: 0 as number,  // Ändere den Typ zu Zahl
    img: null as File | null
  };

  genres: { [key: string]: string[] } = { 
    '1': ['Fantasy', 'Science-Fiction', 'Krimi', 'Historischer Roman', 'Horror', 'Abenteuer', 'Liebesroman'], 
    '2': ['Drama', 'Komödie', 'Thriller', 'Mystery', 'Dokumentation', 'Animation', 'Reality-TV'], 
    '3': ['Action', 'Abenteuer', 'Komödie', 'Drama', 'Horror', 'Musical', 'Science-Fiction'] 
  };

  availableGenres: string[] = [];

  constructor(private navCtrl: NavController, private http: HttpClient) { }

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

  onFileChange(event: any){
    if (event.target.files && event.target.files.length > 0){
    this.media.img = event.target.files[0];
    } else {
      this.media.img = null;
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', this.media.name);
    formData.append('type', this.media.type);
    formData.append('genre', this.media.genre.toString()); // Konvertiere Genre zu String
    if (this.media.img) {
      formData.append('img', this.media.img);
    } else {
      console.error('Kein Bild ausgewählt');
      alert('Bitte wähle ein Bild aus.');
      return;
    }

    this.http.post('http://localhost:3000/tbl_media', formData).subscribe(response => {
      console.log('Media Eintrag erfolgreich:', response);
      this.navCtrl.navigateRoot('/');
    }, error => {
      console.error('Fehler beim Speichern des Media Eintrags:', error.error || error);
      const errMsg = error.error ? error.error.message : error.statusText;
      alert(`Fehler beim Speichern des Media Eintrags: ${errMsg}`);
    });
  }
}
  