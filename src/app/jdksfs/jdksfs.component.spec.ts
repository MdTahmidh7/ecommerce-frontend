import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JdksfsComponent } from './jdksfs.component';

describe('JdksfsComponent', () => {
  let component: JdksfsComponent;
  let fixture: ComponentFixture<JdksfsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JdksfsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JdksfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
