import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hero-banner',
  templateUrl: './hero-banner.component.html',
  standalone:true,
  styleUrls: ['./hero-banner.component.css']
})
export class HeroBannerComponent {
  @Input() title: string = 'Default Title';
  @Input() subtitle: string = 'Default subtitle text';
}
