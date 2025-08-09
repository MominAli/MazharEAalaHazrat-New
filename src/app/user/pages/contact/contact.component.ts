import { Component } from '@angular/core';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeroBannerComponent } from '../../../shared/components/hero-banner/hero-banner.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FooterComponent,HeroBannerComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

}
