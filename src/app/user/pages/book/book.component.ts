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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    LoaderComponent,
    HeroBannerComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    MatSnackBarModule
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent {
  searchQuery = '';
  itemsPerPage: number = 8;
  currentPage: number = 1;
  loading: boolean = true;
  downloading: boolean = false;
downloadingMap: { [title: string]: boolean } = {};
  books: any[] = [];
  filteredBooks: any[] = [];
isDownloading: boolean = false;

  constructor(
    private bookdetailsService: BookdetailsService,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loading = true;
    console.debug('Fetching book list...');

    this.bookdetailsService.getBookList().subscribe({
      next: (data) => {
        this.books = data;
        this.filteredBooks = data;
        this.loading = false;
        console.info(`Books loaded: ${data.length} items`);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading book list:', err);
      }
    });
  }

  filterBooks(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredBooks = this.books.filter(book =>
      book.title?.toLowerCase().includes(query)
    );
    this.currentPage = 1;
  }

downloadPDF(pdfPath: string, title: string): void {
  this.isDownloading = true; // 🔒 Lock page
  this.downloadingMap[title] = true;

  this.snackBar.open(`Preparing download for "${title}"...`, 'Close', {
    duration: 5000,
    panelClass: ['mat-snack-bar-info']
  });

  this.http.get(pdfPath, { responseType: 'blob' }).subscribe({
    next: (blob) => {
      this.triggerDownload(blob, `${title}.pdf`);
      this.snackBar.open(`"${title}" downloaded successfully.`, 'Close', {
        duration: 5000,
        panelClass: ['mat-snack-bar-success']
      });
    },
    error: (err) => {
      console.error(`Download failed for "${title}":`, err);
      this.snackBar.open(`Unable to download "${title}". Please try again.`, 'Close', {
        duration: 10000,
        panelClass: ['mat-snack-bar-error']
      });
    },
    complete: () => {
      this.downloadingMap[title] = false;
      this.isDownloading = false; // 🔓 Unlock page
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

  navigateToBook(item: any): void {
    if (!item.hasChildren) {
      this.router.navigate(['/book-details', item.id]);
    } else {
      this.router.navigate(['/sub-book', item.id]);
    }
  }
}
