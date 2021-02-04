import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecimentoComponent } from './fornecimento.component';

describe('FornecimentoComponent', () => {
  let component: FornecimentoComponent;
  let fixture: ComponentFixture<FornecimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FornecimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FornecimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
