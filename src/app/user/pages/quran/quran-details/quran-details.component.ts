import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import {
  ddlPara,
  ddlSurah,
  ddlQari,
  QurandetailsService,
  Surah,
  Para
} from '../../../services/qurandetails.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { HeroBannerComponent } from '../../../../shared/components/hero-banner/hero-banner.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


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
    HeroBannerComponent,
    MatSnackBarModule

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
  downloading: boolean = false;


  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isMobile = event.target.innerWidth < 768;
  }

  constructor(
    private qurandetailsService: QurandetailsService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackBar: MatSnackBar

  ) { }

  ngOnInit(): void {
    this.loading = true;

    forkJoin({
      ddlSurah: this.qurandetailsService.getddlSurahLists(),
      ddlPara: this.qurandetailsService.getddlParaLists(),
      ddlQari: this.qurandetailsService.getddlQariLists(),
      surahLists: this.qurandetailsService.getSurahLists(),
      paraLists: this.qurandetailsService.getParaLists()
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

    this.route.queryParams.subscribe(params => {
      this.pdfUrl = params['pdf'] || '';
      this.audioUrl = params['audio'] || '';
      const selectedType = params['type'];
      const selectedValue = params['value'];

      if (selectedType === 'para') {
        this.selectedPara = selectedValue;
      } else if (selectedType === 'surah') {
        this.selectedSurah = selectedValue;
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
    this.snackBar.open(`${type.toUpperCase()} file not available.`, 'Close', { duration: 3000 });
    return;
  }

  this.downloading = true;
  const fileType = type === 'pdf' ? 'PDF' : 'Audio';
  this.snackBar.open(`Downloading ${fileType}...`, 'Close', { duration: 3000 });

  let filename = 'quran-file';
  if (this.selectedPara) {
    filename = `para${this.selectedPara.padStart(2, '0')}.${type === 'pdf' ? 'pdf' : 'mp3'}`;
  } else if (this.selectedSurah) {
    filename = `surah${this.selectedSurah.padStart(2, '0')}.${type === 'pdf' ? 'pdf' : 'mp3'}`;
  }

  this.http.get(url, { responseType: 'blob' }).subscribe({
    next: (blob) => {
      this.triggerDownload(blob, filename, type === 'pdf' ? 'application/pdf' : 'audio/mpeg');
      this.snackBar.open(`${fileType} downloaded successfully!`, 'Close', { duration: 3000 });
      this.downloading = false;
    },
    error: (err) => {
      console.error(`${fileType} download failed:`, err);
      this.snackBar.open(`Failed to download ${fileType}.`, 'Close', { duration: 4000 });
      this.downloading = false;
    }
  });
}


 private triggerDownload(blob: Blob, filename: string, mimeType = 'application/octet-stream'): void {
  const url = URL.createObjectURL(new Blob([blob], { type: mimeType }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

}
