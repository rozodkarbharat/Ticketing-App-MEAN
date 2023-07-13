import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatsGridComponent } from './seats-grid.component';

describe('SeatsGridComponent', () => {
  let component: SeatsGridComponent;
  let fixture: ComponentFixture<SeatsGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeatsGridComponent]
    });
    fixture = TestBed.createComponent(SeatsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
