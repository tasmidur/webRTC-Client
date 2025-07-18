import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCallComponent } from './view-call.component';

describe('ViewCallComponent', () => {
  let component: ViewCallComponent;
  let fixture: ComponentFixture<ViewCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
