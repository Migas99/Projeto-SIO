import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { YearSelectorService } from 'app/services/year-selector/year-selector.service';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '/vendas', title: 'Vendas', icon: 'point_of_sale', class: '' },
  {
    path: '/fornecimento',
    title: 'Fornecimento',
    icon: 'content_paste',
    class: '',
  },
  {
    path: '/import_saft',
    title: 'Import SAFT',
    icon: 'cloud_upload',
    class: '',
  },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  years: number[];
  year: number = -1;
  constructor(
    private api: ApiService,
    private yearService: YearSelectorService
  ) {}

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    this.getSaftYears();
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  public getSaftYears(): void {
    this.api.getSaftYears().subscribe((res) => {
      this.years = res;
      this.year = this.years[0];
      this.yearService.sendYear(this.year);
    });
  }

  public sendYear(year: number): void {
    this.yearService.sendYear(year);
  }

  public onChange(value): void {
    this.year = value;
    this.sendYear(this.year);
  }
}
