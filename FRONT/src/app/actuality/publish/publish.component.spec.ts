import { ComponentFixture, TestBed } from '@angular/core/testing';

import { publishComponent } from './publish.component';

describe('publishComponent', () => {
  let component: publishComponent;
  let fixture: ComponentFixture<publishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ publishComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(publishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
