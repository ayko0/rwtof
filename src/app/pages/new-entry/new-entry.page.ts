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
    genre: '',
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
      this.media.genre = '';
    } else {
      this.availableGenres = [];
      this.media.genre = 'Bitte wählen Sie zuerst einen Typ aus';
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
    formData.append('genre', this.media.genre);
    if (this.media.img) {
      formData.append('img', this.media.img);
    }
    else{
      console.error('Kein Bild ausgewählt');
      return;
    }

    this.http.post('http://localhost:3000/tbl_media', formData).subscribe(response =>{
      console.log('Media Eintrag erfolgreich:', response);
    this.navCtrl.navigateRoot('/');
  }, error=> {
    console.error('Fehler beim Speichern des Media Eintrags:', error); 
    alert('Fehler beim Speichern des Media Eintrags');  
  })
  }



}
