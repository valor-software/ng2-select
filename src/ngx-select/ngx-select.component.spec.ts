import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from '../select.module';
import { NgxSelectComponent } from './ngx-select.component';

@Component({
  selector: 'select-test',
  template: `
    <ngx-select id="sel-1" #component1
                [allowClear]="select1.allowClear"
                [placeholder]="select1.placeholder"
                [idField]="select1.idField"
                [textField]="select1.textField"
                [childrenField]="select1.childrenField"
                [multiple]="select1.multiple"
                [noAutoComplete]="select1.noAutoComplete"
                [items]="select1.items"
                [disabled]="select1.disabled"
                [active]="select1.active"

                (data)="select1.data($event)"
                (selected)="select1.selected($event)"
                (removed)="select1.removed($event)"
                (typed)="select1.typed($event)"
                (opened)="select1.opened($event)"></ngx-select>
    <ngx-select id="sel-2" #component2
                [formControl]="select2.formControl"
                [allowClear]="select2.allowClear"
                [placeholder]="select2.placeholder"
                [idField]="select2.idField"
                [textField]="select2.textField"
                [childrenField]="select2.childrenField"
                [multiple]="select2.multiple"
                [noAutoComplete]="select2.noAutoComplete"
                [items]="select2.items"></ngx-select>
    <ngx-select id="sel-3" #component3
                [(ngModel)]="select3.value"
                [allowClear]="select3.allowClear"
                [placeholder]="select3.placeholder"
                [idField]="select3.idField"
                [textField]="select3.textField"
                [childrenField]="select3.childrenField"
                [multiple]="select3.multiple"
                [noAutoComplete]="select3.noAutoComplete"
                [items]="select3.items"
                [disabled]="select3.disabled"></ngx-select>`
})
class TestNgxSelectComponent {
  @ViewChild('component1') public component1: NgxSelectComponent;
  @ViewChild('component2') public component2: NgxSelectComponent;
  @ViewChild('component3') public component3: NgxSelectComponent;

  public select1: any = {
    allowClear: false,
    placeholder: '',
    idField: 'id',
    textField: 'text',
    childrenField: 'children',
    multiple: false,
    noAutoComplete: false,
    items: [],
    disabled: false,
    active: [],

    data: () => null,
    selected: () => null,
    removed: () => null,
    typed: () => null,
    opened: () => null
  };

  public select2: any = {
    formControl: new FormControl(),

    allowClear: false,
    placeholder: '',
    idField: 'id',
    textField: 'text',
    childrenField: 'children',
    multiple: false,
    noAutoComplete: false,
    items: []
  };

  public select3: any = {
    value: null,

    allowClear: false,
    placeholder: '',
    idField: 'id',
    textField: 'text',
    childrenField: 'children',
    multiple: false,
    noAutoComplete: false,
    items: [],
    disabled: false
  };
}

describe('NgxSelectComponent', () => {
  let fixture: ComponentFixture<TestNgxSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SelectModule],
      declarations: [TestNgxSelectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestNgxSelectComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
    expect(fixture.componentInstance.component1).toBeTruthy();
    expect(fixture.componentInstance.component2).toBeTruthy();
    expect(fixture.componentInstance.component3).toBeTruthy();
  });
});
