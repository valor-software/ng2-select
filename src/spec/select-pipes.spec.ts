import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { SelectModule, SelectComponent } from '../ng2-select';

@Component({
  selector: 'select-test',
  template: `
    <ng-select id="sel-1" #component1
               [allowClear]="select1.allowClear"
               [placeholder]="select1.placeholder"
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
               (opened)="select1.opened($event)"></ng-select>
    <ng-select id="sel-2" #component2
               [formControl]="select2.formControl"
               [allowClear]="select2.allowClear"
               [placeholder]="select2.placeholder"
               [textField]="select2.textField"
               [childrenField]="select2.childrenField"
               [multiple]="select2.multiple"
               [noAutoComplete]="select2.noAutoComplete"
               [items]="select2.items"
               [active]="select2.active"></ng-select>
    <ng-select id="sel-3" #component3 [multiple]="true"></ng-select>`
})
class TestSelectComponent {
  @ViewChild('component1') public component1: SelectComponent;
  @ViewChild('component2') public component2: SelectComponent;
  @ViewChild('component3') public component3: SelectComponent;

  public select1: any = {
    allowClear: false,          // +
    placeholder: '',
    idField: 'id',
    textField: 'text',
    childrenField: 'children',
    multiple: false,            // +
    noAutoComplete: false,      // +
    items: [],                  // +
    disabled: false,            // +
    active: [],

    data: (v: any) => console.log('data', v),
    selected: (v: any) => console.log('selected', v),
    removed: (v: any) => console.log('removed', v),
    typed: (v: any) => console.log('typed', v),
    opened: (v: any) => console.log('opened', v)
  };

  public select2: any = {
    formControl: new FormControl(),

    allowClear: false,          // +
    placeholder: '',
    idField: 'id',
    textField: 'text',          // +
    childrenField: 'children',
    multiple: false,            // +
    noAutoComplete: false,      // +
    items: [],                  // +
    active: []
  };
}

describe('Component: ng2-select', () => {
  let fixture: ComponentFixture<TestSelectComponent>;
  const el = (id: number) => fixture.debugElement.nativeElement.querySelector(`#sel-${id} .ui-select-container`);
  const formControl = (id: number) => el(id).querySelector('.form-control');
  const formControlInput = (id: number) => el(id).querySelector('input');
  const selectChoices = (id: number) => el(id).querySelectorAll('.ui-select-choices-row');
  const selectChoiceActive = (id: number) => el(id).querySelector('.ui-select-choices-row.active div');
  const selectedItem = (id: number) => el(id).querySelector('.ui-select-match-text'); // select multiple = false
  const selectedItems = (id: number) => el(id).querySelectorAll('.ui-select-match-item'); // select multiple = true
  const items1 = [
    {id: 1, text: 'v1'},
    {id: 2, text: 'v2'},
    {id: 3, text: 'v3'}
  ];
  const items2 = [
    {id: 1, name: 'v1'},
    {id: 2, name: 'v2'},
    {id: 4, name: 'v4'},
    {id: 5, name: 'v5'}
  ];
  const items3 = [
    {uuid: 'uuid-6', name: 'v6'},
    {uuid: 'uuid-7', name: 'v7'},
    {uuid: 'uuid-8', name: 'v8'},
    {uuid: 'uuid-9', name: 'v9'},
    {uuid: 'uuid-10', name: 'v10'}
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SelectModule],
      declarations: [TestSelectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSelectComponent);

    fixture.componentInstance.select1.allowClear = false;
    fixture.componentInstance.select1.placeholder = '';
    fixture.componentInstance.select1.idField = 'id';
    fixture.componentInstance.select1.textField = 'text';
    fixture.componentInstance.select1.childrenField = 'children';
    fixture.componentInstance.select1.multiple = false;
    fixture.componentInstance.select1.noAutoComplete = false;
    fixture.componentInstance.select1.disabled = false;
    fixture.componentInstance.select1.active = [];

    spyOn(fixture.componentInstance.select1, 'data');
    spyOn(fixture.componentInstance.select1, 'selected');
    spyOn(fixture.componentInstance.select1, 'removed');
    spyOn(fixture.componentInstance.select1, 'typed');
    spyOn(fixture.componentInstance.select1, 'opened');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.component1).toBeTruthy();
    expect(fixture.componentInstance.component2).toBeTruthy();
    expect(fixture.componentInstance.component3).toBeTruthy();
    expect(formControl(1)).toBeTruthy();
    expect(formControl(2)).toBeTruthy();
    expect(formControl(3)).toBeTruthy();

    expect(fixture.componentInstance.select1.data).toHaveBeenCalledTimes(0);
    expect(fixture.componentInstance.select1.selected).toHaveBeenCalledTimes(0);
    expect(fixture.componentInstance.select1.removed).toHaveBeenCalledTimes(0);
    expect(fixture.componentInstance.select1.typed).toHaveBeenCalledTimes(0);
    expect(fixture.componentInstance.select1.opened).toHaveBeenCalledTimes(0);
  });

  it('test default properties', () => {
    expect(fixture.componentInstance.component2.allowClear).toBeFalsy();
    expect(fixture.componentInstance.component2.placeholder).toEqual('');
    expect(fixture.componentInstance.component2.idField).toBe('id');
    expect(fixture.componentInstance.component2.textField).toBe('text');
    expect(fixture.componentInstance.component2.childrenField).toBe('children');
    expect(fixture.componentInstance.component2.multiple).toBeFalsy();
    expect(fixture.componentInstance.component2.noAutoComplete).toBeFalsy();
    expect(fixture.componentInstance.component2.disabled).toBeFalsy();
    expect(fixture.componentInstance.component2.active).toEqual([]);

    expect(fixture.componentInstance.select1.data).toHaveBeenCalledTimes(0);
    expect(fixture.componentInstance.select1.selected).toHaveBeenCalledTimes(0);
    expect(fixture.componentInstance.select1.removed).toHaveBeenCalledTimes(0);
    expect(fixture.componentInstance.select1.typed).toHaveBeenCalledTimes(0);
    expect(fixture.componentInstance.select1.opened).toHaveBeenCalledTimes(0);
  });

  it('should be only one dropdown for all select components', () => {
    // after create
    expect(selectChoices(1).length).toBe(0);
    expect(selectChoices(2).length).toBe(0);
    expect(selectChoices(3).length).toBe(0);

    // open select menu 1
    formControl(1).click();
    fixture.detectChanges();
    expect(formControlInput(1)).toBeTruthy();
    expect(formControlInput(2)).toBeFalsy();
    expect(formControlInput(3)).toBeTruthy();
    expect(selectChoices(1).length).toBe(0);
    expect(selectChoices(2).length).toBe(0);
    expect(selectChoices(3).length).toBe(0);

    // set items to select 1, 2, 3
    fixture.componentInstance.select1.items = items1;
    fixture.componentInstance.component2.items = items1;
    fixture.componentInstance.component3.items = items1;
    fixture.detectChanges();
    expect(formControlInput(1)).toBeTruthy();
    expect(formControlInput(2)).toBeFalsy();
    expect(formControlInput(3)).toBeTruthy();
    expect(selectChoices(1).length).toBe(0);
    expect(selectChoices(2).length).toBe(0);
    expect(selectChoices(3).length).toBe(0);

    // open select menu 2
    formControl(2).click();
    fixture.detectChanges();
    expect(formControlInput(1)).toBeFalsy();
    expect(formControlInput(2)).toBeTruthy();
    expect(formControlInput(3)).toBeTruthy();
    expect(selectChoices(1).length).toBe(0);
    expect(selectChoices(2).length).toBe(3);
    expect(selectChoices(3).length).toBe(0);

    // open select menu 3
    formControl(3).click();
    fixture.detectChanges();
    expect(formControlInput(1)).toBeFalsy();
    expect(formControlInput(2)).toBeFalsy();
    expect(formControlInput(3)).toBeTruthy();
    expect(selectChoices(1).length).toBe(0);
    expect(selectChoices(2).length).toBe(0);
    expect(selectChoices(3).length).toBe(3);

    // open select menu 1
    formControl(1).click();
    fixture.detectChanges();
    expect(formControlInput(1)).toBeTruthy();
    expect(formControlInput(2)).toBeFalsy();
    expect(formControlInput(3)).toBeTruthy();
    expect(selectChoices(1).length).toBe(3);
    expect(selectChoices(2).length).toBe(0);
    expect(selectChoices(3).length).toBe(0);

    // close all select menus
    fixture.debugElement.nativeElement.click();
    fixture.detectChanges();
    expect(formControlInput(1)).toBeFalsy();
    expect(formControlInput(2)).toBeFalsy();
    expect(formControlInput(3)).toBeTruthy();
    expect(selectChoices(1).length).toBe(0);
    expect(selectChoices(2).length).toBe(0);
    expect(selectChoices(3).length).toBe(0);

    expect(fixture.componentInstance.select1.data).toHaveBeenCalledTimes(0);
    expect(fixture.componentInstance.select1.selected).toHaveBeenCalledTimes(0);
    expect(fixture.componentInstance.select1.removed).toHaveBeenCalledTimes(0);
    expect(fixture.componentInstance.select1.typed).toHaveBeenCalledTimes(0);
    expect(fixture.componentInstance.select1.opened).toHaveBeenCalledTimes(4);
  });

  it('should have not auto complete', () => {
    fixture.componentInstance.select1.noAutoComplete = true;
    fixture.detectChanges();
    formControl(1).click();
    fixture.detectChanges();
    expect(formControlInput(1)).toBeFalsy();
  });

  describe('test without model', () => {
    beforeEach(() => {
      fixture.componentInstance.select1.items = items1;
      fixture.detectChanges();
    });

    describe('should be focused', () => {
      it('single', () => {
        fixture.componentInstance.select1.multiple = false;
      });

      it('multiple', () => {
        fixture.componentInstance.select1.multiple = true;
      });

      afterEach(() => {
        formControl(1).click();
        fixture.detectChanges();
        fixture.detectChanges();
        expect(formControlInput(1)).toBeTruthy();
        expect(formControlInput(1).value).toBe('');
        expect(formControlInput(1)).toBe(document.activeElement);

        expect(fixture.componentInstance.select1.data).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.select1.selected).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.select1.removed).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.select1.typed).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.select1.opened).toHaveBeenCalledTimes(1);
      });
    });

    describe('should selecting items and clean it', () => {
      it('single', fakeAsync(() => {
        expect(formControlInput(1)).toBeFalsy();
        expect(selectedItem(1)).toBeFalsy();

        formControl(1).click();
        fixture.detectChanges();
        expect(formControlInput(1)).toBeTruthy();
        expect(formControlInput(1).value).toBe('');
        expect(selectChoices(1).length).toBe(3);
        expect(selectedItem(1)).toBeFalsy();

        selectChoices(1)[1].click();
        fixture.detectChanges();
        expect(formControlInput(1)).toBeFalsy();
        expect(selectedItem(1)).toBeTruthy();
        expect(selectedItem(1).innerHTML).toBe('v2');

        formControl(1).click();
        tick(10000);
        fixture.detectChanges();
        tick(10000);
        expect(formControlInput(1)).toBeTruthy();
        expect(formControlInput(1).value).toBe('');
        expect(selectChoices(1).length).toBe(3);
        expect(selectedItem(1)).toBeFalsy();

        expect(selectChoiceActive(1)).toBeTruthy();
        // todo: need bug fix for next row testing
        // expect(selectChoiceActive(1).innerHTML).toBe('v2');

        selectChoices(1)[0].click();
        fixture.detectChanges();
        expect(formControlInput(1)).toBeFalsy();
        expect(selectedItem(1)).toBeTruthy();
        expect(selectedItem(1).innerHTML).toBe('v1');
        expect(el(1).querySelector('.btn-link')).toBeFalsy();

        fixture.componentInstance.select1.allowClear = true;
        fixture.detectChanges();
        expect(el(1).querySelector('.btn-link')).toBeTruthy();

        el(1).querySelector('.btn-link').click();
        fixture.detectChanges();
        expect(formControlInput(1)).toBeFalsy();
        expect(selectedItem(1)).toBeFalsy();
      }));

      it('multiple', () => {
        expect(formControlInput(1)).toBeFalsy();
        expect(selectedItems(1).length).toBe(0);

        fixture.componentInstance.select1.multiple = true;
        fixture.detectChanges();
        formControl(1).click();
        fixture.detectChanges();
        expect(formControlInput(1)).toBeTruthy();
        expect(formControlInput(1).value).toBe('');
        expect(selectChoices(1).length).toBe(3);
        expect(selectedItems(1).length).toBe(0);

        selectChoices(1)[0].click();
        fixture.detectChanges();
        expect(formControlInput(1)).toBeTruthy();
        expect(selectedItems(1).length).toBe(1);
        expect(selectedItems(1)[0].querySelector('span').innerHTML).toBe('v1');

        formControl(1).click();
        fixture.detectChanges();
        expect(formControlInput(1)).toBeTruthy();
        expect(formControlInput(1).value).toBe('');
        expect(selectChoices(1).length).toBe(2);
        expect(selectedItems(1).length).toBe(1);

        selectChoices(1)[1].click();
        fixture.detectChanges();
        expect(formControlInput(1)).toBeTruthy();
        expect(selectedItems(1).length).toBe(2);
        expect(selectedItems(1)[0].querySelector('span').innerHTML).toBe('v1');
        expect(selectedItems(1)[1].querySelector('span').innerHTML).toBe('v3');

        selectedItems(1)[1].querySelector('.close').click();
        fixture.detectChanges();
        expect(formControlInput(1)).toBeTruthy();
        expect(selectedItems(1).length).toBe(1);
        expect(selectedItems(1)[0].querySelector('span').innerHTML).toBe('v1');
      });

      afterEach(() => {
        expect(fixture.componentInstance.select1.data).toHaveBeenCalledTimes(3);
        expect(fixture.componentInstance.select1.selected).toHaveBeenCalledTimes(2);
        expect(fixture.componentInstance.select1.removed).toHaveBeenCalledTimes(1);
        expect(fixture.componentInstance.select1.typed).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.select1.opened).toHaveBeenCalledTimes(4);
      });
    });

    describe('should be searched', () => {
      it('single', () => {
        fixture.componentInstance.select1.multiple = false;
        fixture.detectChanges();
      });

      it('multiple', () => {
        fixture.componentInstance.select1.multiple = true;
        fixture.detectChanges();
      });

      afterEach(() => {
        formControl(1).click();
        fixture.detectChanges();
        expect(formControlInput(1)).toBeTruthy();
        expect(selectChoices(1).length).toBe(3);

        formControlInput(1).value = '1';
        formControlInput(1).dispatchEvent(new Event('keyup'));
        fixture.detectChanges();
        expect(selectChoices(1).length).toBe(1);

        formControlInput(1).value = 'v';
        formControlInput(1).dispatchEvent(new Event('keyup'));
        fixture.detectChanges();
        expect(selectChoices(1).length).toBe(3);

        expect(fixture.componentInstance.select1.data).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.select1.selected).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.select1.removed).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.select1.typed).toHaveBeenCalledTimes(2);
        expect(fixture.componentInstance.select1.opened).toHaveBeenCalledTimes(1);
      });
    });

    describe('should be disabled', () => {
      beforeEach(() => {
        fixture.componentInstance.select1.disabled = true;
        fixture.detectChanges();
      });

      it('single', () => {
        formControl(1).click();
        fixture.detectChanges();
        expect(formControlInput(1)).toBeFalsy();
        expect(selectChoices(1).length).toBe(0);
      });

      it('multiple', () => {
        fixture.componentInstance.select1.multiple = true;
        fixture.detectChanges();
        formControl(1).click();
        fixture.detectChanges();
        expect(formControlInput(1)).toBeTruthy();
        expect(selectChoices(1).length).toBe(0);
      });

      afterEach(() => {
        fixture.componentInstance.select1.disabled = false;
        fixture.detectChanges();
        expect(fixture.componentInstance.select1.data).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.select1.selected).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.select1.removed).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.select1.typed).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.select1.opened).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('FormControl should be valid when empty and allowClear', () => {
    beforeEach(() => {
      fixture.componentInstance.select2.textField = 'name';
      fixture.componentInstance.select2.items = items2;
      fixture.componentInstance.select2.allowClear = true;
    });

    it('single', () => {
      fixture.componentInstance.select2.multiple = false;
      fixture.detectChanges();
      expect(fixture.componentInstance.select2.formControl.valid).toBeFalsy();

      formControl(2).click();
      fixture.detectChanges();
      expect(selectChoices(2).length).toBeGreaterThan(0);

      selectChoices(2)[0].click();
      fixture.detectChanges();
      expect(fixture.componentInstance.select2.formControl.valid).toBeTruthy();

      el(2).querySelector('.btn-link').click();
      fixture.detectChanges();
      expect(fixture.componentInstance.select2.formControl.value).toEqual([]);
      expect(fixture.componentInstance.select2.formControl.valid).toBeTruthy();
    });

    it('multiple', () => {
      fixture.componentInstance.select2.multiple = true;
      fixture.detectChanges();
      expect(fixture.componentInstance.select2.formControl.valid).toBeFalsy();

      formControl(2).click();
      fixture.detectChanges();
      expect(selectChoices(2).length).toBeGreaterThan(0);

      selectChoices(2)[0].click();
      fixture.detectChanges();
      expect(fixture.componentInstance.select2.formControl.valid).toBeTruthy();

      selectedItems(2)[0].querySelector('.close').click();
      fixture.detectChanges();
      expect(fixture.componentInstance.select2.formControl.value).toEqual([]);
      expect(fixture.componentInstance.select2.formControl.valid).toBeTruthy();
    });
  });

});
