import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YearSelectorService {
  private yearSubject = new Subject<any>();

  constructor() {}

  public sendYear(year: number): void {
    this.yearSubject.next(year);
  }

  public clearYear(): void {
    this.yearSubject.next();
  }

  public getYear(): Observable<number> {
    return this.yearSubject.asObservable();
  }
}
