import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StripeBookingCheckoutComponent } from './stripe-booking-checkout.component';

describe('StripeBookingCheckoutComponent', () => {
  let component: StripeBookingCheckoutComponent;
  let fixture: ComponentFixture<StripeBookingCheckoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeBookingCheckoutComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StripeBookingCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
