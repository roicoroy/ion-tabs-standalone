import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderReviewPage } from './order-review.page';

describe('OrderReviewPage', () => {
  let component: OrderReviewPage;
  let fixture: ComponentFixture<OrderReviewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OrderReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
