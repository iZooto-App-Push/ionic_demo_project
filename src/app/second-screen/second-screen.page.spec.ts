import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecondScreenPage } from './second-screen.page';

describe('SecondScreenPage', () => {
  let component: SecondScreenPage;
  let fixture: ComponentFixture<SecondScreenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
