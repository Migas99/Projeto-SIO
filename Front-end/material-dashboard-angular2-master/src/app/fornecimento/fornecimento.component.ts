import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { Subscription } from 'rxjs';
import { YearSelectorService } from 'app/services/year-selector/year-selector.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fornecimento',
  templateUrl: './fornecimento.component.html',
  styleUrls: ['./fornecimento.component.css'],
})
export class FornecimentoComponent implements OnInit {
  suppliers: Object[];
  stocks: Object[];
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
      this.loadSuppilersPurchases();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private loadSuppilersPurchases(): void {
    this.api.getSalesBySupplier(this.year).subscribe((res) => {
      this.suppliers = res;
    });
  }
}
