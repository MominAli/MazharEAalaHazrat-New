import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookdetailsService } from '../../services/bookdetails.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeroBannerComponent } from '../../../shared/components/hero-banner/hero-banner.component';
import { HttpClient } from '@angular/common/http';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sub-book',
  standalone: true,
  imports: [
    FooterComponent,
    CommonModule,
    HeroBannerComponent,
    FormsModule,
    NgxPaginationModule,
    MatSnackBarModule
  ],
  templateUrl: './sub-book.component.html',
  styleUrl: './sub-book.component.css'
})
export class SubBookComponent {
  searchQuery = '';
  itemsPerPage: number = 8;
  currentPage: number = 1;
  loading: boolean = true;

 subBook: any[] = [];
  parentTitle: string = 'Books Library';
  downloading: boolean = false;
downloadingMap: { [title: string]: boolean } = {};
isDownloading: boolean = false;

  constructor(
    private bookdetailsService: BookdetailsService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
      private snackBar: MatSnackBar // ✅ Inject here
  ) {}

  ngOnInit(): void {
    const bookId = Number(this.route.snapshot.paramMap.get('bookId'));

 this.bookdetailsService.getBookList().subscribe({
  next: books => {
    console.log('Books loaded:', books);
    const bookId = Number(this.route.snapshot.paramMap.get('bookId'));
    const parent = books.find((b: { id: any; hasChildren: any; }) => Number(b.id) === bookId && b.hasChildren);

    if (parent && Array.isArray(parent.subBooks)) {
      this.subBook = parent.subBooks;
      this.parentTitle = parent.title || this.parentTitle;
    } else {
      console.warn('No sub-books found for bookId:', bookId);
      this.subBook = [];
    }

    this.loading = false;
  },
  error: err => {
    console.error('Book load error:', err);
    this.loading = false;
  }
});

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

  get filteredBooks(): any[] {
    return this.subBook.filter(book =>
      book.title?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
