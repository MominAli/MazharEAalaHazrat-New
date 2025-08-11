import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { Surah, Para, QuranStateService } from '../../services/quran-state.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { HeroBannerComponent } from '../../../shared/components/hero-banner/hero-banner.component';

// src/app/models/quran-navigation-payload.ts

export interface QuranNavigationPayload {
  pdfUrl: string;
  audioUrl: string;
  type: 'para' | 'surah';
  value: string | number;
}

@Component({
  selector: 'app-quran',
  standalone: true,
  imports: [FooterComponent, HeroBannerComponent, CommonModule, LoaderComponent],
  templateUrl: './quran.component.html',
  styleUrl: './quran.component.css'
})
export class QuranComponent implements OnInit {
  surahLists: Surah[] = [];
  paraLists: Para[] = [];
  loading = true;

  constructor(
    private router: Router,
    private quranStateService: QuranStateService
  ) { }

  ngOnInit(): void {
    this.loadSurahAndParaLists();
  }

  private loadSurahAndParaLists(): void {
    console.debug('📦 Fetching Surah and Para lists...');

    forkJoin({
      surahs: this.quranStateService.getSurahLists(),
      paras: this.quranStateService.getParaLists()
    }).subscribe({
      next: ({ surahs, paras }) => {
        this.surahLists = surahs;
        this.paraLists = paras;
        console.info(`✅ Loaded ${surahs.length} Surahs and ${paras.length} Paras`);
      },
      error: (err) => {
        console.error('❌ Error loading data:', err);
      },
      complete: () => {
        this.loading = false;
        console.debug('✅ Data loading complete');
      }
    });
  }

  private navigateToDetails(item: QuranNavigationPayload): void {
    this.quranStateService.setDetails(item);
    this.router.navigate(['/quran-details']);
  }
  goToParaDetails(item: Para): void {
    this.navigateToDetails({
      pdfUrl: item.pdfUrl,
      audioUrl: item.audioUrl,
      type: 'para',
      value: item.paraNumber
    });
  }

  goToSurahDetails(item: Surah): void {
    this.navigateToDetails({
      pdfUrl: item.pdfUrl,
      audioUrl: item.audioUrl,
      type: 'surah',
      value: item.surahNumber
    });
  }
}
