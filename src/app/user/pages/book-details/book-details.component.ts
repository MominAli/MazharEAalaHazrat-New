import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookdetailsService } from '../../services/bookdetails.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { HeroBannerComponent } from '../../../shared/components/hero-banner/hero-banner.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    LoaderComponent,
    HeroBannerComponent,
    CommonModule,
    FormsModule,
    FooterComponent,
    NgxExtendedPdfViewerModule
  ],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent {
  loading = true;         // Loader for initial data fetch
  loadingPdf = true;      // Loader for PDF rendering
  pdfPath = '';
  title = 'Book Details';
  isMobile: boolean = window.innerWidth < 768;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isMobile = event.target.innerWidth < 768;
  }

  constructor(private route: ActivatedRoute, private bookdetailsService: BookdetailsService) {}

  ngOnInit(): void {
    const bookId = Number(this.route.snapshot.paramMap.get('bookId'));

    this.bookdetailsService.getBookList().subscribe({
      next: (books) => {
        let found = books.find((b: { id: number; hasChildren: any; }) => b.id === bookId && !b.hasChildren);

        if (!found) {
          for (const book of books) {
            if (book.hasChildren && Array.isArray(book.subBooks)) {
              const sub = book.subBooks.find((sb: { id: number; }) => sb.id === bookId);
              if (sub) {
                found = sub;
                break;
              }
            }
          }
        }

        if (found?.pdfPath) {
          this.pdfPath = found.pdfPath;
          this.title = found.title;
        } else {
          console.warn('PDF not found for bookId:', bookId);
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching book list:', err);
        this.loading = false;
      }
    });
  }
  onPageRendered(): void {
    setTimeout(() => {
      this.loadingPdf = false;
    }, 300); // Smooth fade-in
  }
}
