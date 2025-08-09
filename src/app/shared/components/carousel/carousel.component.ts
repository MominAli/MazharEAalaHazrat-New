import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  carouselOneInterval = 2000; // Interval in milliseconds
  carouselTwoInterval = 3000; // Interval in milliseconds

  carouselOneItems = [
    { src: '../../../../assets/img/slider/img-01.jpeg', alt: 'Slide 1' },
    { src: '../../../../assets/img/slider/img-02.jpg', alt: 'Slide 2' }
  ];

  carouselTwoItems = [
    { src: '../../../../assets/img/slider/img-01.jpeg', alt: 'Slide 1' },
    { src: '../../../../assets/img/slider/img-02.jpg', alt: 'Slide 2' }
  ];
}
