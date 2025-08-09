import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "../app/shared/components/nav/nav.component";
import { AccountService } from '../app/admin/services/account.service';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { CarouselComponent } from '../app/shared/components/carousel/carousel.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, NavComponent, NgxSpinnerComponent,CarouselComponent]
})
export class AppComponent implements OnInit {
  private accountService = inject(AccountService);

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }


}
