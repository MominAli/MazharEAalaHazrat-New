import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "../app/shared/components/nav/nav.component";
import { AccountService } from '../app/admin/services/account.service';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { CarouselComponent } from '../app/shared/components/carousel/carousel.component';
import { CommonModule } from '@angular/common'; // ✅ Import this
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, NavComponent, NgxSpinnerComponent, CarouselComponent,CommonModule]
})
export class AppComponent implements OnInit {
  private accountService = inject(AccountService);

  deferredPrompt: any = null;
  showInstallButton: boolean = false;

  ngOnInit(): void {
    this.setCurrentUser();
    this.listenForInstallPrompt();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }

  listenForInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton = true;
    });
  }

  installApp() {
    if (!this.deferredPrompt) return;

    (this.deferredPrompt as any).prompt();
    (this.deferredPrompt as any).userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      this.deferredPrompt = null;
      this.showInstallButton = false;
    });
  }
}
