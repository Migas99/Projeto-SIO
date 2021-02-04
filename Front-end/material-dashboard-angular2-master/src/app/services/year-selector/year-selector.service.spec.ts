import { TestBed } from '@angular/core/testing';

import { YearSelectorService } from './year-selector.service';

describe('YearSelectorService', () => {
  let service: YearSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YearSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
