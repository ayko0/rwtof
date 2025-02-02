import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EdittrackingPage } from './edittracking.page';

describe('EdittrackingPage', () => {
  let component: EdittrackingPage;
  let fixture: ComponentFixture<EdittrackingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EdittrackingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
