import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  breadcrumbs: { label: string; url: string }[] = [];

  constructor(private router: Router) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.breadcrumbs = this.buildBreadcrumbs(this.router.routerState.snapshot.root);
    });
  }

  buildBreadcrumbs(route: ActivatedRouteSnapshot, url: string = '', breadcrumbs: any[] = []): any[] {
    debugger;
    const label = route.data['breadcrumb'];
    const path = route.routeConfig?.path;
    if (label && path) {
      const fullUrl = `${url}/${path}`;
      breadcrumbs.push({ label, url: fullUrl });
    }
    if (route.firstChild) {
      return this.buildBreadcrumbs(route.firstChild, url, breadcrumbs);
    }
    return breadcrumbs;
  }

  getBreadcrumbs(): { label: string; url: string }[] {
    return this.breadcrumbs;
  }
}
