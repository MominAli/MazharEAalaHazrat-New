import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { Surah, Para, QurandetailsService } from '../../services/qurandetails.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { HeroBannerComponent } from '../../../shared/components/hero-banner/hero-banner.component';

@Component({
  selector: 'app-quran',
  standalone: true,
  imports: [FooterComponent,HeroBannerComponent, CommonModule, LoaderComponent],
  templateUrl: './quran.component.html',
  styleUrl: './quran.component.css'
})
export class QuranComponent implements OnInit {
  surahLists: Surah[] = [];
  paraLists: Para[] = [];
  loading = true;

  constructor(
    private router: Router,
    private qurandetailsService: QurandetailsService
  ) {}

  ngOnInit(): void {
    this.loadSurahAndParaLists();
  }

  private loadSurahAndParaLists(): void {
    console.debug('📦 Fetching Surah and Para lists...');
    
    forkJoin({
      surahs: this.qurandetailsService.getSurahLists(),
      paras: this.qurandetailsService.getParaLists()
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

  private navigateToDetails(item: { pdfUrl: string; audioUrl: string; type: string; value: string | number }): void {
    this.router.navigate(['/quran-details'], {
      queryParams: {
        pdf: item.pdfUrl,
        audio: item.audioUrl,
        type: item.type,
        value: item.value
      }
    });
  }

  goToParaDetails(item: Para): void {
    this.navigateToDetails({
      pdfUrl: item.pdfUrl,
      audioUrl: item.audioUrl,
      type: item.type,
      value: item.paraNumber
    });
  }

  goToSurahDetails(item: Surah): void {
    this.navigateToDetails({
      pdfUrl: item.pdfUrl,
      audioUrl: item.audioUrl,
      type: item.type,
      value: item.surahNumber
    });
  }
}
