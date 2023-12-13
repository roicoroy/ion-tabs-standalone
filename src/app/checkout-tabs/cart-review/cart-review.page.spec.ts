import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartReviewPage } from './cart-review.page';

describe('CartReviewPage', () => {
  let component: CartReviewPage;
  let fixture: ComponentFixture<CartReviewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CartReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
