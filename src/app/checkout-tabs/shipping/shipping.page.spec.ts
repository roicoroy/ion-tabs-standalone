import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShippingPage } from './shipping.page';

describe('ShippingPage', () => {
  let component: ShippingPage;
  let fixture: ComponentFixture<ShippingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ShippingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
