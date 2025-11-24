import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterGlitchComponent } from './letter-glitch.component';

describe('LetterGlitchComponent', () => {
  let component: LetterGlitchComponent;
  let fixture: ComponentFixture<LetterGlitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LetterGlitchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterGlitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
