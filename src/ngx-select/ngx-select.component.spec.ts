import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { Component, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from '../select.module';
import { NgxSelectComponent } from './ngx-select.component';
import createSpy = jasmine.createSpy;

@Component({
  selector: 'select-test',
  template: `

    <ngx-select id="sel-1" #component1
                [defaultValue]="select1.defaultValue"
                [allowClear]="select1.allowClear"
                [placeholder]="select1.placeholder"
                [optionValueField]="select1.optionValueField"
                [optionTextField]="select1.optionTextField"
                [optGroupLabelField]="select1.optGroupLabelField"
                [optGroupOptionsField]="select1.optGroupOptionsField"
                [multiple]="select1.multiple"
                [noAutoComplete]="select1.noAutoComplete"
                [items]="select1.items"
                [disabled]="select1.disabled"
                [(ngModel)]="select1.value"></ngx-select>
    <ngx-select id="sel-2" #component2
                [defaultValue]="select2.defaultValue"
                [allowClear]="select2.allowClear"
                [placeholder]="select2.placeholder"
                [optionValueField]="select2.optionValueField"
                [optionTextField]="select2.optionTextField"
                [optGroupLabelField]="select2.optGroupLabelField"
                [optGroupOptionsField]="select2.optGroupOptionsField"
                [multiple]="select2.multiple"
                [noAutoComplete]="select2.noAutoComplete"
                [items]="select2.items"
                [formControl]="select2.formControl"></ngx-select>
  `
})
class TestNgxSelectComponent {
  @ViewChild('component1') public component1: NgxSelectComponent;
  @ViewChild('component2') public component2: NgxSelectComponent;

  public select1: any = {
    value: null,
    defaultValue: [],

    allowClear: false,
    placeholder: '',
    optionValueField: 'value',
    optionTextField: 'text',
    optGroupLabelField: 'label',
    optGroupOptionsField: 'options',
    multiple: false,
    noAutoComplete: false,
    items: [],
    disabled: false
  };

  public select2: any = {
    formControl: new FormControl(),
    defaultValue: [],

    allowClear: false,
    placeholder: '',
    optionValueField: 'value',
    optionTextField: 'text',
    optGroupLabelField: 'label',
    optGroupOptionsField: 'options',
    multiple: false,
    noAutoComplete: false,
    items: []
  };
}

const items1 = [
  {value: 1, text: 'item one'},
  {value: 2, text: 'item two'},
  {value: 3, text: 'item three'},
  {value: 4, text: 'item four'},
];
const items2 = [
  {uuid: 'uuid-6', name: 'v6'},
  {uuid: 'uuid-7', name: 'v7'},
  {uuid: 'uuid-8', name: 'v8'},
  {uuid: 'uuid-9', name: 'v9'},
  {uuid: 'uuid-10', name: 'v10'}
];

const createKeyboardEvent = (typeArg: string, keyCode: number, key: string = '') => {
  const customEvent = new CustomEvent(typeArg, {bubbles: true, cancelable: true});
  customEvent['keyCode'] = keyCode;
  customEvent['key'] = key;
  return customEvent;
};

describe('NgxSelectComponent', () => {
  let fixture: ComponentFixture<TestNgxSelectComponent>;
  const el = (id: number) => fixture.debugElement.nativeElement.querySelector(`#sel-${id} .ui-select-container`);
  const formControl = (id: number) => el(id).querySelector('.form-control');
  const formControlInput = (id: number) => el(id).querySelector('input');
  const selectChoicesContainer = (id: number) => el(id).querySelector('.ui-select-choices');
  // const selectChoices = (id: number) => el(id).querySelectorAll('.ui-select-choices-row div');
  const selectChoices = (id: number) => fixture.debugElement.nativeElement
    .querySelectorAll(`#sel-${id} .ui-select-container.open .ui-select-choices-row div`);
  const selectChoiceActive = (id: number) => el(id).querySelector('.ui-select-choices-row.active div');
  const selectedItem = (id: number) => el(id).querySelector('.ui-select-match-text'); // select multiple = false
  const selectedItems = (id: number) => el(id).querySelectorAll('.ui-select-match-item'); // select multiple = true

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SelectModule],
      declarations: [TestNgxSelectComponent]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TestNgxSelectComponent);
    fixture.detectChanges();
    // tick(200);
  }));

  it('should create', () => {
    expect(fixture).toBeTruthy();
    expect(fixture.componentInstance.component1).toBeTruthy();
    expect(fixture.componentInstance.component2).toBeTruthy();
  });

  it('should create with closed menu', () => {
    expect(selectChoices(1).length).toBe(0);
    expect(selectChoices(2).length).toBe(0);
  });

  describe('should have value', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(TestNgxSelectComponent);
    });

    it('equal empty by ngModel', () => {
      expect(fixture.componentInstance.select1.value).toEqual(null);
    });

    it('equal empty by FormControl', () => {
      expect(fixture.componentInstance.select2.formControl.value).toEqual(null);
    });

    it('equal default value by FormControl', () => {
      const valueChanged = createSpy('valueChanged');
      fixture.componentInstance.select2.formControl.valueChanges.subscribe(v => valueChanged(v));

      fixture.componentInstance.select2.defaultValue = 3;
      fixture.componentInstance.select2.multiple = false;
      fixture.componentInstance.select2.items = items1;
      fixture.componentInstance.select2.formControl.setValue(null, {emitEvent: false});
      fixture.detectChanges();
      expect(fixture.componentInstance.select2.formControl.value).toEqual(3);
      expect(valueChanged).toHaveBeenCalledTimes(1);
    });

    it('equal default value by ngModel', () => {
      fixture.detectChanges();
      fixture.componentInstance.select1.defaultValue = 3;
      fixture.componentInstance.select1.multiple = false;
      fixture.componentInstance.select1.items = items1;
      fixture.componentInstance.select1.value = null;

      fixture.detectChanges();
      expect(fixture.componentInstance.select1.value).toEqual(3);
    });
  });

  describe('should change value by change defaultValue', () => {
    let valueChanged;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestNgxSelectComponent);
      fixture.componentInstance.select2.items = items1;

      valueChanged = createSpy('valueChanged');
      fixture.componentInstance.select2.formControl.valueChanges.subscribe(v => valueChanged(v));

      fixture.detectChanges();
    });

    it('with not multiple', () => {
      expect(fixture.componentInstance.select2.formControl.value).toEqual(null);

      fixture.componentInstance.select2.defaultValue = [3];
      fixture.detectChanges();
      expect(fixture.componentInstance.select2.formControl.value).toEqual(3);

      fixture.componentInstance.select2.formControl.setValue(2);
      fixture.detectChanges();
      expect(fixture.componentInstance.select2.formControl.value).toEqual(2);

      fixture.componentInstance.select2.defaultValue = 1;
      fixture.detectChanges();
      expect(fixture.componentInstance.select2.formControl.value).toEqual(2);

      fixture.componentInstance.select2.defaultValue = 2;
      fixture.detectChanges();
      expect(fixture.componentInstance.select2.formControl.value).toEqual(2);

      fixture.componentInstance.select2.defaultValue = [4];
      fixture.detectChanges();
      expect(fixture.componentInstance.select2.formControl.value).toEqual(2);
    });

    afterEach(() => {
      expect(valueChanged).toHaveBeenCalledTimes(2);
    });
  });

  describe('should return values from items only when items is not contain some values', function () {
    const createItems = (values: number[]) => values.map(v => {
      return {value: v, text: 'val ' + v};
    });

    it('by ngModel', fakeAsync(() => {
      fixture.componentInstance.select1.multiple = true;
      fixture.componentInstance.select1.items = createItems([1, 2, 3, 4, 5]);
      fixture.componentInstance.select1.value = [1, 3, 4];
      fixture.detectChanges();
      tick();
      expect(fixture.componentInstance.select1.value).toEqual([1, 3, 4]);
      fixture.componentInstance.select1.items = createItems([1, 2, 4, 5, 6]);
      fixture.detectChanges();
      expect(fixture.componentInstance.select1.value).toEqual([1, 4]);
    }));

    it('by FormControl', () => {
      fixture.componentInstance.select2.multiple = true;
      fixture.detectChanges();
      fixture.componentInstance.select2.items = createItems([1, 2, 3, 4, 5]);
      fixture.componentInstance.select2.formControl.setValue([1, 3, 4]);
      fixture.detectChanges();
      // tick();
      expect(fixture.componentInstance.select2.formControl.value).toEqual([1, 3, 4]);
      fixture.componentInstance.select2.items = createItems([1, 2, 4, 5, 6]);
      fixture.detectChanges();
      expect(fixture.componentInstance.select2.formControl.value).toEqual([1, 4]);
    });
  });

  describe('should create with default property', () => {
    it('"allowClear" should be false', () => {
      expect(fixture.componentInstance.component2.allowClear).toBeFalsy();
    });

    it('"placeholder" should be empty string', () => {
      expect(fixture.componentInstance.component2.placeholder).toEqual('');
    });

    it('"optionValueField" should be "id"', () => {
      expect(fixture.componentInstance.component2.optionValueField).toBe('value');
    });

    it('"optionTextField" should be "text"', () => {
      expect(fixture.componentInstance.component2.optionTextField).toBe('text');
    });

    it('"optGroupLabelField" should be "children"', () => {
      expect(fixture.componentInstance.component2.optGroupLabelField).toBe('label');
    });

    it('"optGroupOptionsField" should be "children"', () => {
      expect(fixture.componentInstance.component2.optGroupOptionsField).toBe('options');
    });

    it('"multiple" should be false', () => {
      expect(fixture.componentInstance.component2.multiple).toBeFalsy();
    });

    it('"noAutoComplete" should be false', () => {
      expect(fixture.componentInstance.component2.noAutoComplete).toBeFalsy();
    });

    it('"disabled" should be false', () => {
      expect(fixture.componentInstance.component2.disabled).toBeFalsy();
    });
  });

  describe('property noAutoComplete should', () => {
    beforeEach(() => {
      fixture.componentInstance.select1.noAutoComplete = true;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
    });

    it('hide an input control', () => {
      expect(formControlInput(1)).toBeFalsy();
    });
  });

  describe('menu should be opened', () => {
    beforeEach(fakeAsync(() => {
      fixture.componentInstance.component1.items = items1;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
    }));

    it('by click', () => {
      // expect(fixture.componentInstance.component1.itemObjects.length).toBeGreaterThan(0);
      expect(selectChoices(1).length).toBeGreaterThan(0);
    });
  });

  describe('menu should be closed', () => {
    beforeEach(() => {
      fixture.componentInstance.component1.items = items1;
      fixture.componentInstance.component2.items = items1;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      expect(selectChoices(1).length).toBeGreaterThan(0);
    });

    it('by off click', () => fixture.debugElement.nativeElement.click());

    it('by select item', () => selectChoices(1)[0].click());

    it('by press button Escape', () => {
      formControl(1).dispatchEvent(createKeyboardEvent('keyup', 27)); // key Escape
    });

    it('by open other menu', () => formControl(2).click());

    afterEach(() => {
      fixture.detectChanges();
      expect(selectChoices(1).length).toBe(0);
    });
  });

  describe('after open menu with no selected item', () => {
    beforeEach(() => {
      fixture.componentInstance.component1.items = items1;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      expect(selectChoices(1).length).toBeGreaterThan(0);
    });

    it('first item is active', () => {
      expect(selectChoiceActive(1).innerHTML).toBe('item one');
    });
  });

  describe('menu should be have navigation and active item should be visible', () => {
    beforeEach(() => {
      const items: Array<{ id: number; text: string }> = [];
      for (let i = 1; i <= 100; i++) {
        items.push({id: i, text: 'item ' + i});
      }
      fixture.componentInstance.component1.items = items;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      expect(selectChoices(1).length).toBeGreaterThan(0);
    });

    it('activate last item by press the button arrow right', () => {
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 39)); // arrow right
      fixture.detectChanges();
      expect(selectChoiceActive(1).innerHTML).toBe('item 100');
    });

    it('activate previous item by press the button arrow up', () => {
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 39)); // arrow right
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 38)); // arrow up
      fixture.detectChanges();
      expect(selectChoiceActive(1).innerHTML).toBe('item 99');
    });

    it('activate first item by press the button arrow left', () => {
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 39)); // arrow right
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 37)); // arrow left
      fixture.detectChanges();
      expect(selectChoiceActive(1).innerHTML).toBe('item 1');
    });

    it('activate next item by press the button arrow down', () => {
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 40)); // arrow down
      fixture.detectChanges();
      expect(selectChoiceActive(1).innerHTML).toBe('item 2');
    });

    afterEach(() => {
      const viewPortHeight = selectChoicesContainer(1).clientHeight,
        scrollTop = selectChoicesContainer(1).scrollTop,
        activeItemTop = selectChoiceActive(1).offsetTop;
      expect((scrollTop <= activeItemTop) && (activeItemTop <= scrollTop + viewPortHeight)).toBeTruthy();
    });
  });

  describe('should select', () => {
    describe('a single item with ngModel', () => {
      beforeEach(() => {
        fixture.componentInstance.select1.items = items1;
        fixture.componentInstance.select1.multiple = false;
        fixture.detectChanges();
        formControl(1).click();
        fixture.detectChanges();
        expect(selectChoices(1).length).toBeGreaterThan(0);
      });

      it('by click on choice item', () => {
        selectChoices(1)[1].click();
      });

      it('by press the key Enter on a choice item', () => {
        formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 40)); // arrow down
        formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 13)); // key Enter
      });

      afterEach(() => {
        fixture.detectChanges();
        expect(selectedItem(1).innerHTML).toBe('item two');
        expect(fixture.componentInstance.select1.value).toEqual(2);
      });
    });

    describe('a single item with FormControl', () => {
      beforeEach(() => {
        fixture.componentInstance.select2.items = items1;
        fixture.componentInstance.select2.multiple = false;
        fixture.detectChanges();
        formControl(2).click();
        fixture.detectChanges();
        expect(selectChoices(2).length).toBeGreaterThan(0);
      });

      it('by click on choice item', () => {
        selectChoices(2)[1].click();
      });

      it('by press the key Enter on a choice item', () => {
        formControlInput(2).dispatchEvent(createKeyboardEvent('keydown', 40)); // arrow down
        formControlInput(2).dispatchEvent(createKeyboardEvent('keydown', 13)); // key Enter
      });

      afterEach(() => {
        fixture.detectChanges();
        expect(selectedItem(2).innerHTML).toBe('item two');
        expect(fixture.componentInstance.select2.formControl.value).toEqual(2);
      });
    });

    describe('multiple items with ngModel', () => {
      beforeEach(() => {
        fixture.componentInstance.select1.items = items1;
        fixture.componentInstance.select1.multiple = true;
        fixture.detectChanges();
        formControl(1).click();
        fixture.detectChanges();
        expect(selectChoices(1).length).toBeGreaterThan(0);
      });

      it('by clicking on choice items', () => {
        selectChoices(1)[1].click();
        fixture.detectChanges();
        formControl(1).click();
        fixture.detectChanges();
        selectChoices(1)[2].click();
      });

      it('by press the key Enter on choice items', () => {
        formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 40)); // arrow down
        formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 13)); // key Enter
        fixture.detectChanges();
        formControl(1).click();
        fixture.detectChanges();
        formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 40)); // arrow down
        formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 40)); // arrow down
        formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 13)); // key Enter
      });

      afterEach(() => {
        fixture.detectChanges();
        expect(selectedItems(1).length).toBe(2);
        expect(selectedItems(1)[0].querySelector(' span').innerHTML).toBe('item two');
        expect(selectedItems(1)[1].querySelector(' span').innerHTML).toBe('item four');
        expect(fixture.componentInstance.select1.value).toEqual([2, 4]);
      });
    });

    describe('multiple items with FormControl', () => {
      beforeEach(() => {
        fixture.componentInstance.select2.items = items1;
        fixture.componentInstance.select2.multiple = true;
        fixture.detectChanges();
        formControl(2).click();
        fixture.detectChanges();
        expect(selectChoices(2).length).toBeGreaterThan(0);
      });

      it('by clicking on choice items', () => {
        selectChoices(2)[1].click();
        fixture.detectChanges();
        formControl(2).click();
        fixture.detectChanges();
        selectChoices(2)[2].click();
      });

      it('by press the key Enter on choice items', () => {
        formControlInput(2).dispatchEvent(createKeyboardEvent('keydown', 40)); // arrow down
        formControlInput(2).dispatchEvent(createKeyboardEvent('keydown', 13)); // key Enter
        fixture.detectChanges();
        formControl(2).click();
        fixture.detectChanges();
        formControlInput(2).dispatchEvent(createKeyboardEvent('keydown', 40)); // arrow down
        formControlInput(2).dispatchEvent(createKeyboardEvent('keydown', 40)); // arrow down
        formControlInput(2).dispatchEvent(createKeyboardEvent('keydown', 13)); // key Enter
      });

      afterEach(() => {
        fixture.detectChanges();
        expect(selectedItems(2).length).toBe(2);
        expect(selectedItems(2)[0].querySelector(' span').innerHTML).toBe('item two');
        expect(selectedItems(2)[1].querySelector(' span').innerHTML).toBe('item four');
        expect(fixture.componentInstance.select2.formControl.value).toEqual([2, 4]);
      });
    });
  });

  describe('should remove selected', () => {
    describe('from select with ngModel', () => {
      beforeEach(() => {
        fixture.componentInstance.select1.items = items1;
        fixture.componentInstance.select1.allowClear = true;
        fixture.detectChanges();
        formControl(1).click();
        fixture.detectChanges();
        selectChoices(1)[0].click();
        fixture.detectChanges();
        expect(selectedItem(1).innerHTML).toBe('item one');
        expect(fixture.componentInstance.select1.value).toEqual(1);
      });

      it('a single item', () => {
        el(1).querySelector('.btn-link').click();
        fixture.detectChanges();
        expect(selectedItem(1)).toBeFalsy();
        expect(fixture.componentInstance.select1.value).toEqual(null);
      });

      it('multiple items', () => {
        fixture.componentInstance.select1.multiple = true;
        fixture.detectChanges();
        selectedItems(1)[0].querySelector('.close').click();
        fixture.detectChanges();
        expect(selectedItems(1).length).toBe(0);
        expect(fixture.componentInstance.select1.value).toEqual([]);
      });
    });

    describe('from select with FormControl', () => {
      beforeEach(() => {
        fixture.componentInstance.select2.items = items1;
        fixture.componentInstance.select2.allowClear = true;
        fixture.detectChanges();
        formControl(2).click();
        fixture.detectChanges();
        selectChoices(2)[0].click();
        fixture.detectChanges();
        expect(selectedItem(2).innerHTML).toBe('item one');
        expect(fixture.componentInstance.select2.formControl.value).toEqual(1);
      });

      it('a single item', () => {
        el(2).querySelector('.btn-link').click();
        fixture.detectChanges();
        expect(selectedItem(2)).toBeFalsy();
        expect(fixture.componentInstance.select2.formControl.value).toEqual(null);
      });

      it('multiple items', () => {
        fixture.componentInstance.select2.multiple = true;
        fixture.detectChanges();
        selectedItems(2)[0].querySelector('.close').click();
        fixture.detectChanges();
        expect(selectedItems(2).length).toBe(0);
        expect(fixture.componentInstance.select2.formControl.value).toEqual([]);
      });
    });
  });

  describe('after click', () => {
    beforeEach(() => {
      fixture.componentInstance.select1.items = items1;
      fixture.detectChanges();
    });

    it('single select should focus the input field', () => {
      fixture.componentInstance.select1.multiple = false;
    });

    it('multiple select should focus the input field', () => {
      fixture.componentInstance.select1.multiple = true;
    });

    afterEach(() => {
      formControl(1).click();
      fixture.detectChanges();
      fixture.detectChanges();
      expect(formControlInput(1)).toBeTruthy();
      expect(formControlInput(1)).toBe(document.activeElement);
    });
  });

  describe('choice items should be filtered by input text', () => {
    const items = ['Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest'];

    it('with preload items', () => {
      fixture.componentInstance.select1.items = items;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      formControlInput(1).value = 'br';
      formControlInput(1).dispatchEvent(createKeyboardEvent('keyup', 82, 'r'));
      fixture.detectChanges();
      expect(selectChoices(1).length).toBe(3);
    });

    it('with lazy load items', () => {
      fixture.componentInstance.select1.items = [];
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      formControlInput(1).value = 'br';
      formControlInput(1).dispatchEvent(createKeyboardEvent('keyup', 82, 'r'));
      fixture.detectChanges();
      fixture.componentInstance.select1.items = items;
      fixture.detectChanges();
      expect(selectChoices(1).length).toBe(3);
    });
  });

  describe('should be disabled', () => {
    beforeEach(() => {
      fixture.componentInstance.select1.disabled = true;
      fixture.componentInstance.select2.formControl.disable();
      fixture.detectChanges();
    });

    it('single select by attribute', () => {
      formControl(1).click();
      fixture.detectChanges();
      expect(formControlInput(1)).toBeFalsy();
      expect(selectChoices(1).length).toBe(0);
    });

    it('multiple select by attribute', () => {
      fixture.componentInstance.select1.multiple = true;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      expect(formControlInput(1)).toBeTruthy();
      expect(formControlInput(1).disabled).toBeTruthy();
      expect(selectChoices(1).length).toBe(0);
    });

    it('single select by FormControl.disable()', () => {
      formControl(2).click();
      fixture.detectChanges();
      expect(formControlInput(2)).toBeFalsy();
      expect(selectChoices(2).length).toBe(0);
    });

    it('multiple select by FormControl.disable()', () => {
      fixture.componentInstance.select2.multiple = true;
      fixture.detectChanges();
      formControl(2).click();
      fixture.detectChanges();
      expect(formControlInput(2)).toBeTruthy();
      expect(formControlInput(2).disabled).toBeTruthy();
      expect(selectChoices(2).length).toBe(0);
    });
  });

  describe('should setup items from array of', () => {
    it('objects with default id & text fields', () => {
      fixture.componentInstance.select1.items = items1;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      expect(selectChoices(1).length).toBe(items1.length);
    });

    it('objects without default id & text fields ', () => {
      fixture.componentInstance.select1.idField = 'uuid';
      fixture.componentInstance.select1.optionTextField = 'name';
      fixture.componentInstance.select1.items = items2;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      expect(selectChoices(1).length).toBe(items2.length);
    });

    it('objects with mixed id & text fields', () => {
      fixture.componentInstance.select1.optionValueField = 'id';
      fixture.componentInstance.select1.items = [
        {id: 0, text: 'i0'}, {xId: 1, text: 'i1'}, {id: 2, xText: 'i2'},
        {xId: 3, xText: 'i3'}, {id: 4, text: 'i4'},
      ];
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      expect(selectChoices(1).length).toBe(4);
      expect(selectChoices(1)[0].innerHTML).toBe('i0');
      expect(selectChoices(1)[1].innerHTML).toBe('i1');
    });

    it('objects with children fields by default field names', () => {
      fixture.componentInstance.select1.items = [
        {label: '1', options: [{value: 11, text: '11'}]},
        {label: '2', options: [{value: 21, text: '21'}, {value: 22, text: '22'}]}
      ];
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      expect(selectChoices(1).length).toBe(3);
    });

    it('objects with children fields by not default field names', () => {
      fixture.componentInstance.select1.optGroupLabelField = 'xText';
      fixture.componentInstance.select1.optGroupOptionsField = 'xChildren';
      fixture.componentInstance.select1.optionValueField = 'xId';
      fixture.componentInstance.select1.optionTextField = 'xText';
      fixture.componentInstance.select1.items = [
        {xText: '1', xChildren: {xId: 11, xText: '11'}},
        {xText: '2', xChildren: [{xId: 21, xText: '21'}, {xId: 22, xText: '22'}]}
      ];
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      expect(selectChoices(1).length).toBe(3);
    });

    it('strings', () => {
      fixture.componentInstance.select1.items = ['one', 'two', 'three'];
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      expect(selectChoices(1).length).toBe(3);
    });
  });

  describe('should set selected items ', () => {
    describe('for single select with preload items', () => {
      beforeEach(fakeAsync(() => {
        fixture.componentInstance.select1.multiple = false;
        fixture.componentInstance.select1.items = items1;
        fixture.componentInstance.select1.value = [items1[1].value];

        fixture.componentInstance.select2.multiple = false;
        fixture.componentInstance.select2.items = items1;
        fixture.componentInstance.select2.formControl.setValue([items1[1].value]);

        fixture.detectChanges();
        tick();
        fixture.detectChanges();
      }));

      it('by a ngModel attribute and selected item must be active in menu', () => {
        expect(selectedItem(1).innerHTML).toBe(items1[1].text);
        formControl(1).click();
        fixture.detectChanges();
        expect(selectChoiceActive(1).innerHTML).toBe(items1[1].text);
      });

      it('by a FormControl attribute and selected item must be active in menu', () => {
        expect(selectedItem(2).innerHTML).toBe(items1[1].text);
        formControl(2).click();
        fixture.detectChanges();
        expect(selectChoiceActive(2).innerHTML).toBe(items1[1].text);
      });
    });

    describe('for multiple select with preload items', () => {
      beforeEach(fakeAsync(() => {
        fixture.componentInstance.select1.multiple = true;
        fixture.componentInstance.select1.items = items1;
        fixture.componentInstance.select1.value = [items1[0].value, items1[1].value];

        fixture.componentInstance.select2.multiple = true;
        fixture.componentInstance.select2.items = items1;
        fixture.componentInstance.select2.formControl.setValue([items1[0].value, items1[1].value]);

        fixture.detectChanges();
        tick();
        fixture.detectChanges();
      }));

      it('by a ngModel attribute', () => {
        expect(selectedItems(1)[0].querySelector('span').innerHTML).toBe(items1[0].text);
        expect(selectedItems(1)[1].querySelector('span').innerHTML).toBe(items1[1].text);
      });

      it('by a FormControl attribute', () => {
        expect(selectedItems(2)[0].querySelector('span').innerHTML).toBe(items1[0].text);
        expect(selectedItems(2)[1].querySelector('span').innerHTML).toBe(items1[1].text);
      });
    });

    describe('for single select with lazy loading items', () => {
      beforeEach(fakeAsync(() => {
        const lazyItems = [];

        fixture.componentInstance.select1.multiple = false;
        fixture.componentInstance.select1.items = lazyItems;
        fixture.componentInstance.select1.value = [items1[1].value];

        fixture.componentInstance.select2.multiple = false;
        fixture.componentInstance.select2.items = lazyItems;
        fixture.componentInstance.select2.formControl.setValue([items1[1].value]);

        fixture.detectChanges();
        setTimeout(() => items1.forEach(item => lazyItems.push(item)), 2000);
        tick(2100);
        fixture.detectChanges();
      }));

      it('by a ngModel attribute and selected item must be active in menu', () => {
        expect(selectedItem(1).innerHTML).toBe(items1[1].text);
        formControl(1).click();
        fixture.detectChanges();
        expect(selectChoiceActive(1).innerHTML).toBe(items1[1].text);
      });

      it('by a FormControl attribute and selected item must be active in menu', () => {
        expect(selectedItem(2).innerHTML).toBe(items1[1].text);
        formControl(2).click();
        fixture.detectChanges();
        expect(selectChoiceActive(2).innerHTML).toBe(items1[1].text);
      });
    });

    describe('for multiple select with lazy loading items', () => {
      beforeEach(fakeAsync(() => {
        const lazyItems = [];

        fixture.componentInstance.select1.multiple = true;
        fixture.componentInstance.select1.items = lazyItems;
        fixture.componentInstance.select1.value = [items1[0].value, items1[1].value];

        fixture.componentInstance.select2.multiple = true;
        fixture.componentInstance.select2.items = lazyItems;
        fixture.componentInstance.select2.formControl.setValue([items1[0].value, items1[1].value]);

        fixture.detectChanges();
        setTimeout(() => items1.forEach(item => lazyItems.push(item)), 2000);
        tick(2100);
        fixture.detectChanges();
      }));

      it('by a ngModel attribute', () => {
        expect(selectedItems(1)[0].querySelector('span').innerHTML).toBe(items1[0].text);
        expect(selectedItems(1)[1].querySelector('span').innerHTML).toBe(items1[1].text);
      });

      it('by a FormControl attribute', () => {
        expect(selectedItems(2)[0].querySelector('span').innerHTML).toBe(items1[0].text);
        expect(selectedItems(2)[1].querySelector('span').innerHTML).toBe(items1[1].text);
      });
    });
  });

  describe('should not emit value after lazy load items', () => {
    const valueChanged = createSpy('valueChanged');
    let lazyItems: any[] = [];

    beforeEach(fakeAsync(() => {
      fixture.componentInstance.select2.items = lazyItems;
      fixture.componentInstance.select2.formControl.valueChanges.subscribe((v) => {
        console.log('valueChanges', v);
        valueChanged(v);
      });
      fixture.detectChanges();
      fixture.componentInstance.select2.formControl.setValue(3);
      fixture.detectChanges();
    }));

    it('for single mode', fakeAsync(() => {
      lazyItems = items1;
      fixture.detectChanges();
      expect(valueChanged).toHaveBeenCalledTimes(1);
      expect(valueChanged).toHaveBeenCalledWith(3);
    }));
  });
});
