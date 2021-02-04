import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { YearSelectorService } from 'app/services/year-selector/year-selector.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.css'],
})
export class VendasComponent implements OnInit {
  clients: Object[];
  products: Object[];
  year: number = -1;
  subscription: Subscription;

  constructor(
    private api: ApiService,
    private yearService: YearSelectorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription = this.yearService.getYear().subscribe((year: number) => {
      if (!year) this.router.navigate(['import_saft']);
      this.year = year;
      this.loadClientsSales();
      this.loadProductSales();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  /**
   *
   */
  private loadClientsSales(): void {
    this.api.getSalesByCustomer(this.year).subscribe((res) => {
      this.clients = res || [];
    });
  }

  private loadProductSales(): void {
    this.api.getSalesByProduct(this.year).subscribe((res) => {
      this.products = res || [];
    });
  }
}
