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

  selectedType: number = 1;  // Standardmäßig auf 1 (Buch) gesetzt
  entries: any[] = [];
  selectedTypeName: string = 'Buch';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.loadEntries();
  }

  loadEntries() {
    console.log(`Lade Einträge vom Typ ${this.selectedType}`);
    this.http.get<any[]>(`http://localhost:3000/tbl_media?type=${this.selectedType}`)
      .subscribe(data => {
        console.log('Erhaltene Daten:', data);
        this.entries = data.map(entry => ({
          imgURL: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(new Blob([entry.img], { type: 'image/png' }))),
          name: entry.name
        }));
        console.log('Verarbeitete Einträge:', this.entries);
      }, error => {
        console.error('Fehler beim Laden der Einträge:', error);
      });
  }

  onTypeChange(event: any) {
    this.selectedType = event.detail.value;
    this.selectedTypeName = this.getTypeName(this.selectedType);
    console.log('Ausgewählter Typ geändert:', this.selectedTypeName);
  }

  getTypeName(type: number): string {
    switch (type) {
      case 1: return 'Buch';
      case 2: return 'Serie';
      case 3: return 'Film';
      default: return 'Unbekannt';
    }
  }
}


