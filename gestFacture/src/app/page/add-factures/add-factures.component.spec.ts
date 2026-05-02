import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFacturesComponent } from './add-factures.component';

describe('AddFacturesComponent', () => {
  let component: AddFacturesComponent;
  let fixture: ComponentFixture<AddFacturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFacturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFacturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
