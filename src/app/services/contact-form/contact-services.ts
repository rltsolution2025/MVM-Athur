import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactServices {
  private baseUrl = 'https://localhost:5000/api/contact';

  constructor(private http: HttpClient) {}

  submitContact(data: any): Observable<any> {
  return this.http.post(this.baseUrl, data, {
    headers: { 'Content-Type': 'application/json' }
  });
}

  // Optional: Get all contacts (for testing/admin)
  getContacts(): Observable<any> {
    return this.http.get(this.baseUrl);
  }
}
