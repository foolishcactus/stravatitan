import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sidepane } from './sidepane';

describe('Sidepane', () => {
  let component: Sidepane;
  let fixture: ComponentFixture<Sidepane>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidepane]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sidepane);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
