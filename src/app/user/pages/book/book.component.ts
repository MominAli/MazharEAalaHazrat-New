import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookdetailsService } from '../../services/bookdetails.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { HeroBannerComponent } from '../../../shared/components/hero-banner/hero-banner.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    LoaderComponent,
    HeroBannerComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent {
  searchQuery = '';
  mobileTabsVisible = false;
  itemsPerPage: number = 12;
  currentPage: number = 1;
  loading: boolean = true;

  books: any[] = [];

  constructor(
    private bookdetailsService: BookdetailsService,
    private router: Router,
    private http: HttpClient

  ) { }

  ngOnInit(): void {
    this.loading = true;
    console.debug('Fetching book list...');

    this.bookdetailsService.getBookList().subscribe({
      next: (data) => {
        this.books = data;
        this.loading = false;
        console.info(`Books loaded: ${data.length} items`);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading book list:', err);
      }
    });
  }
  downloadPDF(pdfPath: string, title: string): void {
    this.http.get(pdfPath, { responseType: 'blob' }).subscribe({
      next: (blob) => this.triggerDownload(blob, `${title}.pdf`),
      error: (err) => {
        console.error('Download failed:', err);
        alert('Sorry, this PDF could not be downloaded.');
      }
    });
  }

  private triggerDownload(blob: Blob, filename: string, mimeType = 'application/pdf'): void {
    const url = URL.createObjectURL(new Blob([blob], { type: mimeType }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Unified navigation method for both sub-books and book details
   */
  navigateToBook(item: any): void {
    if (!item.hasChildren) {
      this.router.navigate(['/book-details', item.id]);
    } else {
      this.router.navigate(['/sub-book', item.id]);
    }
  }
}

