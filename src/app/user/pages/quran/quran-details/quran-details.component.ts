import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import {ddlPara,ddlSurah,ddlQari,QuranStateService,Surah,Para } from '../../../services/quran-state.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { HeroBannerComponent } from '../../../../shared/components/hero-banner/hero-banner.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-quran-details',
  standalone: true,
  imports: [
    // Angular & Shared Modules
    CommonModule,
    FormsModule,
    RouterOutlet,
    NgxExtendedPdfViewerModule,
    LoaderComponent,
    FooterComponent,
    HeroBannerComponent
  ],
  templateUrl: './quran-details.component.html',
  styleUrl: './quran-details.component.css'
})
export class QuranDetailsComponent implements OnInit {
  ddlSurah: ddlSurah[] = [];
  ddlPara: ddlPara[] = [];
  ddlQari: ddlQari[] = [];
  surahLists: Surah[] = [];
  paraLists: Para[] = [];

  selectedPara: string = '';
  selectedSurah: string = '';
  audioUrl: string = '';
  pdfUrl: string = '';

  loading: boolean = true;
  public isMobile: boolean = window.innerWidth < 768;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isMobile = event.target.innerWidth < 768;
  }

  constructor(
    private quranStateService: QuranStateService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    const payload = this.quranStateService.getDetails();

    if (!payload) {
      this.snackBar.open('Please select a Surah or Para from the library.', 'Close', { duration: 3000 });
      this.router.navigate(['/quran']);
      return;
    }

    this.pdfUrl = payload.pdfUrl;
    this.audioUrl = payload.audioUrl;
    this.selectedPara = payload.type === 'para' ? payload.value.toString() : '';
    this.selectedSurah = payload.type === 'surah' ? payload.value.toString() : '';

    // Load dropdowns and lists as before
    this.loadDropdownsAndLists();
  }

  private loadDropdownsAndLists(): void {
    this.loading = true;
    forkJoin({
      ddlSurah: this.quranStateService.getddlSurahLists(),
      ddlPara: this.quranStateService.getddlParaLists(),
      ddlQari: this.quranStateService.getddlQariLists(),
      surahLists: this.quranStateService.getSurahLists(),
      paraLists: this.quranStateService.getParaLists()
    }).subscribe({
      next: (result) => {
        this.ddlSurah = result.ddlSurah;
        this.ddlPara = result.ddlPara;
        this.ddlQari = result.ddlQari;
        this.surahLists = result.surahLists;
        this.paraLists = result.paraLists;
      },
      error: (err) => {
        console.error('Error loading Quran lists:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  onParaChange(event: any): void {
    const selected = this.paraLists.find(p => p.paraNumber === event.target.value);
    if (selected) {
      this.pdfUrl = selected.pdfUrl;
      this.audioUrl = selected.audioUrl;
      this.selectedPara = selected.paraNumber.toString();
    }
    this.selectedSurah = '';
  }
  onSurahChange(event: any): void {
    const selected = this.surahLists.find(s => s.surahNumber === event.target.value);
    if (selected) {
      this.pdfUrl = selected.pdfUrl;
      this.audioUrl = selected.audioUrl;
      this.selectedSurah = selected.surahNumber.toString();
    }
    this.selectedPara = '';
  }

  download(type: 'pdf' | 'audio'): void {
    const url = type === 'pdf' ? this.pdfUrl : this.audioUrl;

    if (!url) {
      console.warn(`${type.toUpperCase()} URL is missing.`);
      return;
    }

    let filename = 'quran-file';
    if (this.selectedPara) {
      filename = `para${this.selectedPara.padStart(2, '0')}.${type === 'pdf' ? 'pdf' : 'mp3'}`;
    } else if (this.selectedSurah) {
      filename = `surah${this.selectedSurah.padStart(2, '0')}.${type === 'pdf' ? 'pdf' : 'mp3'}`;
    }

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => this.triggerDownload(blob, filename),
      error: (err) => console.error(`${type.toUpperCase()} download failed:`, err)
    });
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
