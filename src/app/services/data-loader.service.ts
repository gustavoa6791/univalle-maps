import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataLoaderService {

  private jsonUrl = 'assets/data.json';

  constructor(private http: HttpClient) {}

  getJsonData(): Observable<any> {
    return this.http.get(this.jsonUrl);
  }
  
}
