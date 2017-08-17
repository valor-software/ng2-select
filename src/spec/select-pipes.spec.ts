import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectModule } from '../ng-next-select';

const html = ``;

describe('Component: ng-next-select', () => {
  let fixture:ComponentFixture<any>;
  let context:TestSelectComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestSelectComponent],
      imports: [SelectModule]
    });
    TestBed.overrideComponent(TestSelectComponent, {set: {template: html}});
    fixture = TestBed.createComponent(TestSelectComponent);
    context = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('fixture should not be null', () => {
    expect(fixture).not.toBeNull();
  });
});

@Component({
  selector: 'select-test',
  template: '<ng-select></ng-select>'
})

class TestSelectComponent {
}
