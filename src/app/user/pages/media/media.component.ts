import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { MediadetailsService } from '../../services/mediadetails.service';
import { HeroBannerComponent } from '../../../shared/components/hero-banner/hero-banner.component';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [LoaderComponent, FooterComponent,HeroBannerComponent, CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './media.component.html',
  styleUrl: './media.component.css'
})
export class MediaComponent implements OnInit {
  categories: { title: string; label: string }[] = [];
  tabContent: Record<string, any[]> = {};
  filteredTabContent: Record<string, any[]> = {};
  currentPages: Record<string, number> = {};

  activeTab = 0;
  searchQuery = '';
  itemsPerPage = 8;
  totalCategories = 0;
  mobileTabsVisible = false;
  loading = true;

  constructor(
    private mediadetailsService: MediadetailsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    console.debug('Fetching media list...');
    this.loading = true;

    this.mediadetailsService.getMediaList().subscribe({
      next: (data) => {
        this.categories = data.categories;
        this.tabContent = this.initializeItems(data.tabContent);
        this.filteredTabContent = { ...this.tabContent };
        this.totalCategories = this.categories.length;
        this.categories.forEach(cat => {
          this.currentPages[cat.label] = 1;
        });
        console.log(`Loaded ${this.totalCategories} categories`);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching media list:', err);
        this.loading = false;
      }
    });
        window.addEventListener('online', () => this.isOnline = true);
    window.addEventListener('offline', () => this.isOnline = false);
  }
   isOnline: boolean = navigator.onLine;


  ngOnDestroy() {
    window.removeEventListener('online', () => this.isOnline = true);
    window.removeEventListener('offline', () => this.isOnline = false);
  }

  private initializeItems(content: Record<string, any[]>): Record<string, any[]> {
    const initialized: Record<string, any[]> = {};
    for (const label in content) {
      initialized[label] = content[label].map(item => ({
        ...item,
        loaded: false
      }));
    }
    return initialized;
  }

  changeTab(index: number): void {
    this.activeTab = index;
    this.mobileTabsVisible = false;
  }

  toggleMenu(): void {
    this.mobileTabsVisible = !this.mobileTabsVisible;
  }

  // sanitizeUrl(url: string): SafeResourceUrl {
  //   const embedUrl = url.includes('watch?v=') ? url.replace('watch?v=', 'embed/') : url;
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  // }

  sanitizeUrl(url: string): SafeResourceUrl {
  const videoId = this.extractVideoId(url);
  return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
}


  extractVideoId(url: string): string {
    const match = url.match(/embed\/([^?]+)/);
    return match ? match[1] : '';
  }

  filterResults(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredTabContent = {};

    for (const label in this.tabContent) {
      this.filteredTabContent[label] = this.tabContent[label].filter(item =>
        item.name.toLowerCase().includes(query)
      );
    }
  }

  onPageChange(page: number): void {
    const activeLabel = this.categories[this.activeTab]?.label;
    if (activeLabel) {
      this.currentPages[activeLabel] = page;
    }
  }
}
