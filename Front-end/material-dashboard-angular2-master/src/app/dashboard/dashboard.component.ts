import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { Subscription } from 'rxjs';
import { YearSelectorService } from 'app/services/year-selector/year-selector.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  clients: Object[];
  suppliers: Object[];
  auditFile: Object;
  year: number = -1;
  numberBought: number;
  salesTotalsByPeriod: Object[];
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
      this.loadData();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private loadData() {
    this.loadClients();
    this.loadSuppliers();
    this.loadAuditFiles();
    this.loadSalesByPeriod();
  }

  private loadClients(): void {
    this.api
      .getAllClients(this.year)
      .subscribe((res) => (this.clients = res || []));
  }

  private loadSuppliers(): void {
    this.api
      .getAllSuppliers(this.year)
      .subscribe((res) => (this.suppliers = res || []));
  }

  private loadAuditFiles(): void {
    this.api.getAuditFileTotals(this.year).subscribe((res) => {
      this.auditFile = res.Totals || undefined;
      if (this.auditFile) {
        this.numberBought = res.Totals.TotalEntries - res.Totals.NumberOfSales;
      } else {
        this.numberBought = 0;
      }
    });
  }

  private loadSalesByPeriod(): void {
    this.api.getSalesByPeriod(this.year).subscribe((res) => {
      this.salesTotalsByPeriod = res.SalesTotalsByPeriod;
    });
  }
}
