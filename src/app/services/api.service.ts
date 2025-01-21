import { Injectable } from "@angular/core"; 
 
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";  
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class APIservice {

    //PHP Links
    private baseURL ='http://localhost/rwtof/';

    private apiURLgetkunde = 'http://localhost/rwtof/get_kunde.php';
    private apiURLgetwartung = 'http://localhost/rwtof/get_wartung.php';

   
    constructor(public http: HttpClient) {}

    //----------auslesen---------

    getKunde(): Observable<any>
    {
        return this.http.get('${this.baseURL}/get_kunde.php')
    }

    getWartung()
    {
        return this.http.get('${this.baseURL}/get_wartung.php')
    }


    //-------speichern--------

    saveAPIkunde(save_kunde: any): Observable<any>
    {
        return this.http.post(`${this.baseURL}/save_kunde.php`, save_kunde, {
            headers: { 'Content-Type': 'application/json'}
        });
    }
    


    saveAPIwartung(save_wartung: any)
    {
        return this.http.post('${this.baseURL}/save_wartung.php', save_wartung, {
            headers: { 'Content-Type': 'application/json'}
        });
    }

    
}