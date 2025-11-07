import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdmissionServices {
  private baseUrl = 'http://localhost:5000/api/admission';

  constructor(private http: HttpClient) {}

  // Submit admission form
  submitAdmission(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  // Optional: Get all admissions (for testing/admin)
  getAdmissions(): Observable<any> {
    return this.http.get(this.baseUrl);
  }
}
