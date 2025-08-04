import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Myruns } from './myruns';

describe('Myruns', () => {
  let component: Myruns;
  let fixture: ComponentFixture<Myruns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Myruns]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Myruns);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
