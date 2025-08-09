import { Component } from '@angular/core';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeroBannerComponent } from '../../../shared/components/hero-banner/hero-banner.component';

@Component({
  selector: 'app-biograhpy',
  standalone: true,
  imports: [FooterComponent,HeroBannerComponent],
  templateUrl: './biograhpy.component.html',
  styleUrl: './biograhpy.component.css'
})
export class BiograhpyComponent {

}
