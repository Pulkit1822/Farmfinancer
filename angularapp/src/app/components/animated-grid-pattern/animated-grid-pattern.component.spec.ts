import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedGridPatternComponent } from './animated-grid-pattern.component';

describe('AnimatedGridPatternComponent', () => {
  let component: AnimatedGridPatternComponent;
  let fixture: ComponentFixture<AnimatedGridPatternComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimatedGridPatternComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimatedGridPatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
