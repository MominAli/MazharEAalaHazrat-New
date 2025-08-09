import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RegisterComponent } from '../../../admin/pages/register/register.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { EventsComponent } from '../events/events.component';
import { MediaComponent } from '../media/media.component';
import { CarouselComponent } from '../../../shared/components/carousel/carousel.component';
import { BookComponent } from '../../pages/book/book.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [
    RegisterComponent,
    FooterComponent,
    EventsComponent,
    MediaComponent,
    CarouselComponent,
    BookComponent
  ]
})
export class HomeComponent implements OnInit {
  registerMode = false;
  loading = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.debug('Home component initialized');
    this.loading = false;
  }

  registerToggle(): void {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean): void {
    this.registerMode = event;
  }

  navigateTo(path: string): void {
    console.debug(`Navigating to ${path}`);
    this.router.navigate([path]);
  }

  goToBooks(): void {
    this.navigateTo('/book');
  }

  goToMedia(): void {
    this.navigateTo('/media');
  }

  goToQuran(): void {
    this.navigateTo('/quran');
  }

  goToManqabat(): void {
    this.navigateTo('/media'); // Same as goToMedia
  }

  goToFeedBack(): void {
    this.navigateTo('/feedback');
  }

  goToDonation(): void {
    this.navigateTo('/donation');
  }

  goToBiograhpy(): void {
    this.navigateTo('/biograhpy');
  }
}
