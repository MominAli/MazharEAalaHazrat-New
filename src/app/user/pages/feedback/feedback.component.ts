import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeroBannerComponent } from '../../../shared/components/hero-banner/hero-banner.component';

@Component({
  selector: 'app-feedback',
  imports: [FooterComponent,HeroBannerComponent],
  standalone: true,
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      form_name: ['', Validators.required],
      form_email: ['', [Validators.required, Validators.email]],
      form_no: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      form_appointed: [''],
      country: [''],
      form_zone: [''],
      form_kabina: [''],
      form_address: ['', Validators.required],
      form_summary: ['', Validators.required],
      form_message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
    } else {
      console.error('Form is invalid');
    }
  }
}
