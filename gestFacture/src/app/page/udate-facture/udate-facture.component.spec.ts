import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UdateFactureComponent } from './udate-facture.component';

describe('UdateFactureComponent', () => {
  let component: UdateFactureComponent;
  let fixture: ComponentFixture<UdateFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UdateFactureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UdateFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
