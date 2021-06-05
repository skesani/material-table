import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarTableDataService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getAllData(): Observable<any[]> {
    return this.http.get<any[]>('https://www.govtrack.us/api/v2/role?current=true&role_type=representative&limit=500');
  }
}
