import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifOtpPage } from './verif-otp.page';

describe('VerifOtpPage', () => {
  let component: VerifOtpPage;
  let fixture: ComponentFixture<VerifOtpPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifOtpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
