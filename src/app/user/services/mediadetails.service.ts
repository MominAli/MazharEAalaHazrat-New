/**
 * -------------------------------------------------------------
 * File Name    : mediadetails.service.ts
 * Description  : Service to retrieve categorized media data from local JSON
 * Author       : Khan Ramzan Ali
 * Created Date : 03-Aug-2025
 * Updated Date : 03-Aug-2025
 * Version      : 1.0.0
 * -------------------------------------------------------------
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediadetailsService {

  private dataUrl = environment.mediaDataPath;
  
  constructor(private http: HttpClient) { }
  getMediaList(): Observable<any> {
    console.debug(`Starting media list fetch from: ${this.dataUrl}`);

    return this.http.get<any>(this.dataUrl).pipe(
      tap(response => {
        console.info(' Media Data loaded successfully:', response);
      }),
      catchError(error => {
        console.error(' Error loading media data:', error);
        return throwError(() => new Error('Data load failed'));
      })
    );
  }

  switchTheme(theme: 'light' | 'dark') {
  const link = document.getElementById('theme-link') as HTMLLinkElement;
  link.href = `assets/themes/${theme}.css`;
}


}
