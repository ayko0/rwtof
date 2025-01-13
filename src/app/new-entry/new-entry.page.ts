import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-new-entry',
  templateUrl: './new-entry.page.html',
  styleUrls: ['./new-entry.page.scss'],
  standalone: true,
  imports: [IonInput, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class NewEntryPage implements OnInit {

  media = {
    name: '',
    type: '',
    genre: ''
  };

  constructor(private navCtrl: NavController, private http: HttpClient) { }

  onSubmit() {
    this.http.post('deine-api-url/tbl_media', this.media).subscribe(response =>{
      console.log('Media Eintrag erfolgreich:', response);
    this.navCtrl.navigateRott('/');
  }, error=> {
    console.error('Fehler beim Speichern des Media Eintrags:', error);   
  })
  }

}
