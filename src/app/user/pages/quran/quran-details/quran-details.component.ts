import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ddlPara, ddlSurah, ddlQari, QuranStateService, Surah, Para } from '../../../services/quran-state.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { HeroBannerComponent } from '../../../../shared/components/hero-banner/hero-banner.component';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ViewChild, ElementRef } from '@angular/core';



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
  downloadingMap: { [title: string]: boolean } = {};
  isDownloading: boolean = false;
  loadingPdf: boolean = true;
  audioKey: any;

  @HostListener('window:resize', ['$event'])
  @ViewChild('audioPlayer') audioPlayerRef?: ElementRef<HTMLAudioElement>;
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
    this.selectedSurah = '';
    this.audioKey++;


    // Collapse dropdown/modal and scroll to content
    (document.activeElement as HTMLElement)?.blur();
    setTimeout(() => {
      this.closeModalBackdrop();
      this.scrollToContent();
    }, 100);
  }

  this.loadDropdownsAndLists();
}

onSurahChange(event: any): void {
  const selected = this.surahLists.find(s => s.surahNumber === event.target.value);
  if (selected) {
    this.pdfUrl = selected.pdfUrl;
    this.audioUrl = selected.audioUrl;
    this.selectedSurah = selected.surahNumber.toString();
    this.selectedPara = '';
    this.audioKey++;

    // Collapse dropdown/modal and scroll to content
    (document.activeElement as HTMLElement)?.blur();
    setTimeout(() => {
      this.closeModalBackdrop();
      this.scrollToContent();
    }, 100);
  }

  this.loadDropdownsAndLists();
}

private closeModalBackdrop(): void {
  const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) {
    backdrop.remove();
  }
}
private resetAudio(): void {
  setTimeout(() => {
    this.audioPlayerRef?.nativeElement?.load();
  }, 100);
}
private scrollToContent(): void {
  const el = document.getElementById('contentStart');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


refreshPage(): void {
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([this.router.url]);
  });
}
 download(type: 'pdf' | 'audio'): void {
  const url = type === 'pdf' ? this.pdfUrl : this.audioUrl;

  if (!url) {
    this.snackBar.open(`${type.toUpperCase()} file not available.`, 'Close', {
      duration: 3000,
      panelClass: ['mat-snack-bar-error']
    });
    console.warn(`${type.toUpperCase()} URL is missing.`);
    return;
  }

  let filename = 'quran-file';
  if (this.selectedPara) {
    filename = `para${this.selectedPara.padStart(2, '0')}.${type === 'pdf' ? 'pdf' : 'mp3'}`;
  } else if (this.selectedSurah) {
    filename = `surah${this.selectedSurah.padStart(2, '0')}.${type === 'pdf' ? 'pdf' : 'mp3'}`;
  }

  this.isDownloading = true; // 🔒 Lock page

  this.snackBar.open(`Preparing ${type.toUpperCase()} download...`, 'Close', {
    duration: 4000,
    panelClass: ['mat-snack-bar-info']
  });

  this.http.get(url, { responseType: 'blob' }).subscribe({
    next: (blob) => {
      this.triggerDownload(blob, filename);
      this.snackBar.open(`${type.toUpperCase()} downloaded successfully.`, 'Close', {
        duration: 3000,
        panelClass: ['mat-snack-bar-success']
      });
    },
    error: (err) => {
      console.error(`${type.toUpperCase()} download failed:`, err);
      this.snackBar.open(`Download failed. Check your connection.`, 'Retry', {
        duration: 6000,
        panelClass: ['mat-snack-bar-error']
      }).onAction().subscribe(() => {
        this.download(type); // 🔁 Retry
      });
    },
    complete: () => {
      this.isDownloading = false; // 🔓 Unlock page
    }
  });
}
 onPageRendered(): void {
    setTimeout(() => {
      this.loadingPdf = false;
    }, 300); // Smooth fade-in
  }


  private triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(new Blob([blob]));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
