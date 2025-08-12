/**
 * -------------------------------------------------------------
 * File Name    : quran-state.service.ts
 * Description  : Service to fetch Surah, Para, and dropdown lists from quran.json
 * Author       : Khan Ramzan Ali
 * Created Date : 11-Aug-2025
 * Updated Date : 11-Aug-2025
 * Version      : 1.0.1
 * -------------------------------------------------------------
 */
export interface Surah {
  type: string;
  surahNumber: number;
  suranameEng: string;
  suranameArabic: string;
  imgSrc: string;
  imgAlt: string;
  pdfUrl:string,
  audioUrl:string
}

export interface Para {
  paraNumber: number;
  paraName: string;
  pdfUrl:string,
  audioUrl:string,
  type:string
}
export interface ddlPara {
  value: number;
  name: string;
}

export interface ddlSurah {
  value: number;
  name: string;
}
export interface ddlQari {
  value: number;
  name: string;
}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

import { BehaviorSubject } from 'rxjs';
// import { QuranNavigationPayload } from '../models/quran-navigation-payload';


// src/app/models/quran-navigation-payload.ts

export interface QuranNavigationPayload {
  pdfUrl: string;
  audioUrl: string;
  type: 'para' | 'surah';
  value: string | number;
}


@Injectable({ providedIn: 'root' })
export class QuranStateService {
  
  private readonly dataUrl = environment.quranDataPath;
    // private readonly dataUrl = 'assets/localDB/quran.json';


  constructor(private http: HttpClient) { }

  getSurahLists(): Observable<Surah[]> {
    console.debug(`Fetching Surah list from: ${this.dataUrl}`);
    return this.http.get<{ surahs: Surah[] }>(this.dataUrl).pipe(
      map((data) => data.surahs),
      tap(data => console.info(`Loaded ${data.length} surahs`)),
      catchError(error => {
        console.error('Failed to load Surah list:', error);
        return throwError(() => new Error('Surah list fetch failed'));
      })
    );
  }
  
  getParaLists(): Observable<Para[]> {
    console.debug(`Fetching Para list from: ${this.dataUrl}`);
    return this.http.get<{ paras: Para[] }>(this.dataUrl).pipe(
      map((data) => data.paras),
      tap(data => console.info(`Loaded ${data.length} paras`)),
      catchError(error => {
        console.error('Failed to load Para list:', error);
        return throwError(() => new Error('Para list fetch failed'));
      })
    );
  }
  
  getddlParaLists(): Observable<ddlPara[]> {
    console.debug(`Fetching dropdown Para list from: ${this.dataUrl}`);
    return this.http.get<{ ddlPara: ddlPara[] }>(this.dataUrl).pipe(
      map((data) => data.ddlPara),
      tap(data => console.info(` Loaded ${data.length} ddlParas`)),
      catchError(error => {
        console.error('Failed to load ddlPara list:', error);
        return throwError(() => new Error('ddlPara list fetch failed'));
      })
    );
  }
  
  getddlSurahLists(): Observable<ddlSurah[]> {
    console.debug(`Fetching dropdown Surah list from: ${this.dataUrl}`);
    return this.http.get<{ ddlSurah: ddlSurah[] }>(this.dataUrl).pipe(
      map((data) => data.ddlSurah),
      tap(data => console.info(`Loaded ${data.length} ddlSurahs`)),
      catchError(error => {
        console.error('Failed to load ddlSurah list:', error);
        return throwError(() => new Error('ddlSurah list fetch failed'));
      })
    );
  }
  
  getddlQariLists(): Observable<ddlQari[]> {
    console.debug(`🎙️ Fetching Qari dropdown list from: ${this.dataUrl}`);
    return this.http.get<{ ddlQari: ddlQari[] }>(this.dataUrl).pipe(
      map((data) => data.ddlQari),
      tap(data => console.info(`Loaded ${data.length} ddlQaris`)),
      catchError(error => {
        console.error('Failed to load ddlQari list:', error);
        return throwError(() => new Error('ddlQari list fetch failed'));
      })
    );
  }
  

  private detailsSubject = new BehaviorSubject<QuranNavigationPayload | null>(null);
  details$ = this.detailsSubject.asObservable();

  setDetails(payload: QuranNavigationPayload): void {
    this.detailsSubject.next(payload);
  }

  getDetails(): QuranNavigationPayload | null {
    return this.detailsSubject.getValue();
  }

  clearDetails(): void {
    this.detailsSubject.next(null);
  }
}
