import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletDetailTransactionPage } from './wallet-detail-transaction.page';

describe('WalletDetailTransactionPage', () => {
  let component: WalletDetailTransactionPage;
  let fixture: ComponentFixture<WalletDetailTransactionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletDetailTransactionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletDetailTransactionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
