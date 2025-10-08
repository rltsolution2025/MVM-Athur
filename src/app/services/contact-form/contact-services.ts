import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactServices {
  private baseUrl = 'https://mvm-athur.onrender.com/api/contact';

  constructor(private http:HttpClient){}

  submitContact(data:any):Observable<any>{
    return this.http.post(this.baseUrl,data);
  }
}
