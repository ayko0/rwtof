import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-new-entry',
  templateUrl: './new-entry.page.html',
  styleUrls: ['./new-entry.page.scss'],
  standalone: true,
  imports: [IonButton, IonInput, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, CommonModule, FormsModule]
})
export class NewEntryPage implements OnInit {

  media = {
    name: '',
    type: '',
    genre: ''
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
      this.media.genre = '';
    } else {
      this.availableGenres = [];
      this.media.genre = 'Bitte wählen Sie zuerst einen Typ aus';
    }
  }

  onSubmit() {
    this.http.post('http://localhost:3000/tbl_media', this.media).subscribe(response =>{
      console.log('Media Eintrag erfolgreich:', response);
    this.navCtrl.navigateRoot('/');
  }, error=> {
    console.error('Fehler beim Speichern des Media Eintrags:', error);   
  })
  }



}
