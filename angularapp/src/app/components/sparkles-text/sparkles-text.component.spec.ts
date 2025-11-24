import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparklesTextComponent } from './sparkles-text.component';

describe('SparklesTextComponent', () => {
  let component: SparklesTextComponent;
  let fixture: ComponentFixture<SparklesTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SparklesTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SparklesTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
