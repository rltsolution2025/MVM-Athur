import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdmissionServices {
  private baseUrl = "https://mvm-athur.onrender.com/api/admission";

  constructor(private http: HttpClient) { }

  submitAdmission(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }
}
