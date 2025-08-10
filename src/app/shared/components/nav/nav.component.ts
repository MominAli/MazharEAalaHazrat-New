import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrService } from 'ngx-toastr';

import { AccountService } from '../../../admin/services/account.service';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { RegisterComponent } from '../../../admin/pages/register/register.component';
import { MediadetailsService } from '../../../user/services/mediadetails.service';


@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule,
    RouterLink,
    RouterLinkActive,
    HasRoleDirective,
    RegisterComponent
  ]
})
export class NavComponent {
  accountService = inject(AccountService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private mediadetailsService = inject(MediadetailsService);

  currentTheme: 'light' | 'dark' = 'light';
  model: Record<string, any> = {};
  registerMode = false;
  isNavbarCollapsed = true;

  @ViewChild('navbarWrapper') navbarWrapper!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const isMobile = window.innerWidth <= 768;
    const clickedInside = this.navbarWrapper?.nativeElement.contains(event.target);

    if (isMobile && !clickedInside && !this.isNavbarCollapsed) {
      this.isNavbarCollapsed = true;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;

    const scrollTop = window.scrollY;
    const threshold = 100;

    navbar.classList.toggle('fixed-top', scrollTop > threshold);
    navbar.classList.toggle('animate', scrollTop > threshold);
    document.body.classList.toggle('has-fixed-navbar', scrollTop > threshold);
  }

  login(): void {
    this.accountService.login(this.model).subscribe({
      next: () => {
        console.debug('Login successful');
        this.router.navigateByUrl('/members');
      },
      error: (err) => {
        console.error('Login error:', err);
        this.toastr.error(err.error);
      }
    });
  }

  logout(): void {
    this.accountService.logout();
    console.debug('👋 Logged out');
    this.router.navigateByUrl('/');
  }

  registerToggle(): void {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean): void {
    this.registerMode = event;
  }

  closeNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.mediadetailsService.switchTheme(this.currentTheme);
  }
}