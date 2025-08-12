/**
 * -------------------------------------------------------------
 * File Name    : bookdetails.service.ts
 * Description  : Service to fetch hierarchical book data from local JSON
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

export interface SubBook {
  id: number;
  title: string;
  img: string;
}

export interface Book {
  id: number;
  title: string;
  hasChildren: boolean;
  img: string;
  subBooks: SubBook[];
}

@Injectable({
  providedIn: 'root'
})


export class BookdetailsService {

  private readonly dataUrl = environment.bookDataPath;

    // private dataUrl = 'assets/localDB/books.json'; // Path to the JSON file


  
  constructor(private http: HttpClient) { }

  getBookList(): Observable<any> {
    console.debug(`Initiating book list fetch from: ${this.dataUrl}`);

    return this.http.get<any>(this.dataUrl).pipe(
      tap(response => {
        console.info('Book data loaded successfully:', response);
      }),
      catchError(error => {
        console.error('Failed to load book data:', error);
        return throwError(() => new Error('Book list fetch failed'));
      })
    );
  }


}
