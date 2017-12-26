import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

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
                [valueField]="select1.valueField"
                [textField]="select1.textField"
                [labelField]="select1.labelField"
                [optionsField]="select1.optionsField"
                [multiple]="select1.multiple"
                [noAutoComplete]="select1.noAutoComplete"
                [items]="select1.items"
                [disabled]="select1.disabled"></ngx-select>
    <ngx-select id="sel-2" #component2
                [formControl]="select2.formControl"
                [allowClear]="select2.allowClear"
                [placeholder]="select2.placeholder"
                [valueField]="select2.valueField"
                [textField]="select2.textField"
                [labelField]="select2.labelField"
                [optionsField]="select2.optionsField"
                [multiple]="select2.multiple"
                [noAutoComplete]="select2.noAutoComplete"
                [items]="select2.items"></ngx-select>
    <ngx-select id="sel-3" #component3
                [(ngModel)]="select3.value"
                [allowClear]="select3.allowClear"
                [placeholder]="select3.placeholder"
                [valueField]="select3.valueField"
                [textField]="select3.textField"
                [labelField]="select3.labelField"
                [optionsField]="select3.optionsField"
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
    valueField: 'value',
    textField: 'text',
    labelField: 'label',
    optionsField: 'options',
    multiple: false,
    noAutoComplete: false,
    items: [],
    disabled: false
  };

  public select2: any = {
    formControl: new FormControl(),

    allowClear: false,
    placeholder: '',
    valueField: 'value',
    textField: 'text',
    labelField: 'label',
    optionsField: 'options',
    multiple: false,
    noAutoComplete: false,
    items: []
  };

  public select3: any = {
    value: null,

    allowClear: false,
    placeholder: '',
    valueField: 'value',
    textField: 'text',
    labelField: 'label',
    optionsField: 'options',
    multiple: false,
    noAutoComplete: false,
    items: [],
    disabled: false
  };
}

const items1 = [
  {id: 1, text: 'item one'},
  {id: 2, text: 'item two'},
  {id: 3, text: 'item three'},
  {id: 4, text: 'item four'},
];
const items2 = [
  {uuid: 'uuid-6', name: 'v6'},
  {uuid: 'uuid-7', name: 'v7'},
  {uuid: 'uuid-8', name: 'v8'},
  {uuid: 'uuid-9', name: 'v9'},
  {uuid: 'uuid-10', name: 'v10'}
];

const createKeyboardEvent = (typeArg: string, keyCode: number) => {
  const customEvent = new CustomEvent(typeArg, {bubbles: true, cancelable: true});
  customEvent['keyCode'] = keyCode;
  return customEvent;
};

describe('NgxSelectComponent', () => {
  let fixture: ComponentFixture<TestNgxSelectComponent>;
  const el = (id: number) => fixture.debugElement.nativeElement.querySelector(`#sel-${id} .ui-select-container`);
  const formControl = (id: number) => el(id).querySelector('.form-control');
  const formControlInput = (id: number) => el(id).querySelector('input');
  const selectChoicesContainer = (id: number) => el(id).querySelector('.ui-select-choices');
  const selectChoices = (id: number) => el(id).querySelectorAll('.ui-select-choices-row div');
  const selectChoiceActive = (id: number) => el(id).querySelector('.ui-select-choices-row.active div');
  const selectedItem = (id: number) => el(id).querySelector('.ui-select-match-text'); // select multiple = false
  const selectedItems = (id: number) => el(id).querySelectorAll('.ui-select-match-item'); // select multiple = true

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

  it('should create with closed menu', () => {
    expect(selectChoices(1).length).toBe(0);
    expect(selectChoices(2).length).toBe(0);
    expect(selectChoices(3).length).toBe(0);
  });

  describe('should create with default property', () => {
    it('"allowClear" should be false', () => {
      expect(fixture.componentInstance.component2.allowClear).toBeFalsy();
    });

    it('"placeholder" should be empty string', () => {
      expect(fixture.componentInstance.component2.placeholder).toEqual('');
    });

    it('"valueField" should be "id"', () => {
      expect(fixture.componentInstance.component2.valueField).toBe('value');
    });

    it('"textField" should be "text"', () => {
      expect(fixture.componentInstance.component2.textField).toBe('text');
    });

    it('"labelField" should be "children"', () => {
      expect(fixture.componentInstance.component2.labelField).toBe('label');
    });

    it('"optionsField" should be "children"', () => {
      expect(fixture.componentInstance.component2.optionsField).toBe('options');
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
    describe('a single item', () => {
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
      });
    });

    describe('multiple items', () => {
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
      });
    });
  });

  describe('should remove selected', () => {
    beforeEach(() => {
      fixture.componentInstance.select1.items = items1;
      fixture.componentInstance.select1.allowClear = true;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      selectChoices(1)[0].click();
      fixture.detectChanges();
      expect(selectedItem(1).innerHTML).toBe('item one');
    });

    it('a single item', () => {
      el(1).querySelector('.btn-link').click();
      fixture.detectChanges();
      expect(selectedItem(1)).toBeFalsy();
    });

    it('multiple items', () => {
      fixture.componentInstance.select1.multiple = true;
      fixture.detectChanges();
      selectedItems(1)[0].querySelector('.close').click();
      fixture.detectChanges();
      expect(selectedItems(1).length).toBe(0);
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

  describe('choice items should be filtered', () => {
    beforeEach(() => {
      fixture.componentInstance.select1.items = items1;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      formControlInput(1).value = 'o';
      formControlInput(1).dispatchEvent(new KeyboardEvent('keyup'));
      fixture.detectChanges();
    });

    it('by input text', () => {
      expect(selectChoices(1).length).toBe(3);
    });
  });

  describe('should be disabled', () => {
    beforeEach(() => {
      fixture.componentInstance.select1.disabled = true;
      fixture.detectChanges();
    });

    it('single select', () => {
      formControl(1).click();
      fixture.detectChanges();
      expect(formControlInput(1)).toBeFalsy();
      expect(selectChoices(1).length).toBe(0);
    });

    it('multiple select', () => {
      fixture.componentInstance.select1.multiple = true;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      expect(formControlInput(1)).toBeTruthy();
      expect(formControlInput(1).disabled).toBeTruthy();
      expect(selectChoices(1).length).toBe(0);
    });
  });

  describe('FormControl should be', () => {
    let tmpFixture: ComponentFixture<TestNgxSelectComponent>;

    beforeEach(() => {
      tmpFixture = TestBed.createComponent(TestNgxSelectComponent);
      tmpFixture.componentInstance.select2.items = items1;
    });

    it('valid when select is: single, empty and allowClear', () => {
      tmpFixture.componentInstance.select2.multiple = false;
      tmpFixture.componentInstance.select2.allowClear = true;
      tmpFixture.detectChanges();
      expect(tmpFixture.componentInstance.select2.formControl.valid).toBeTruthy();
    });

    it('invalid when select is: single, empty and not allowClear', () => {
      tmpFixture.componentInstance.select2.multiple = false;
      tmpFixture.componentInstance.select2.allowClear = false;
      tmpFixture.detectChanges();
      expect(tmpFixture.componentInstance.select2.formControl.valid).toBeFalsy();
    });

    it('valid when select is: multiple and empty', () => {
      tmpFixture.componentInstance.select2.multiple = true;
      tmpFixture.detectChanges();
      expect(tmpFixture.componentInstance.select2.formControl.valid).toBeTruthy();
    });
  });

  xdescribe('should setup items from array of', () => {
    it('objects with default id & text fields', () => {
      fixture.componentInstance.select1.items = items1;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      expect(selectChoices(1).length).toBe(items1.length);
    });

    it('objects without default id & text fields ', () => {
      fixture.componentInstance.select1.idField = 'uuid';
      fixture.componentInstance.select1.textField = 'name';
      fixture.componentInstance.select1.items = items2;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      expect(selectChoices(1).length).toBe(items2.length);
    });

    it('objects with mixed id & text fields', () => {
      fixture.componentInstance.select1.items = [
        {id: 0, text: 'i0'}, {xId: 1, text: 'i1'}, {id: 2, xText: 'i2'}, {id: 3, text: 'i3'},
      ];
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      expect(selectChoices(1).length).toBe(2);
      expect(selectChoices(1)[0].innerHTML).toBe('i0');
      expect(selectChoices(1)[1].innerHTML).toBe('i3');
    });

    it('objects with children fields by default field names', () => {
      fixture.componentInstance.select1.items = [
        {id: 1, text: '1', children: {id: 11, text: '11'}},
        {id: 2, text: '2', children: [{id: 21, text: '21'}, {id: 22, text: '22'}]}
      ];
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      expect(selectChoices(1).length).toBe(3);
    });

    it('objects with children fields by not default field names', () => {
      fixture.componentInstance.select1.idField = 'xId';
      fixture.componentInstance.select1.textField = 'xText';
      fixture.componentInstance.select1.childrenField = 'xChildren';
      fixture.componentInstance.select1.items = [
        {xId: 1, xText: '1', xChildren: {xId: 11, xText: '11'}},
        {xId: 2, xText: '2', xChildren: [{xId: 21, xText: '21'}, {xId: 22, xText: '22'}]}
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

  xdescribe('should set selected items ', () => {
    describe('for single select with preload items', () => {
      beforeEach(fakeAsync(() => {
        fixture.componentInstance.select1.multiple = false;
        fixture.componentInstance.select1.items = items1;
        fixture.componentInstance.select1.active = [items1[1]];

        fixture.componentInstance.select2.multiple = false;
        fixture.componentInstance.select2.items = items1;
        fixture.componentInstance.select2.formControl.setValue([items1[1]]);

        fixture.componentInstance.select3.multiple = false;
        fixture.componentInstance.select3.items = items1;
        fixture.componentInstance.select3.value = [items1[1]];

        fixture.detectChanges();
        tick();
        fixture.detectChanges();
      }));

      it('by the active attribute and selected item must be active in menu', () => {
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

      it('by a ngModel attribute and selected item must be active in menu', () => {
        expect(selectedItem(3).innerHTML).toBe(items1[1].text);
        formControl(3).click();
        fixture.detectChanges();
        expect(selectChoiceActive(3).innerHTML).toBe(items1[1].text);
      });
    });

    describe('for multiple select with preload items', () => {
      beforeEach(fakeAsync(() => {
        fixture.componentInstance.select1.multiple = true;
        fixture.componentInstance.select1.items = items1;
        fixture.componentInstance.select1.active = [items1[0], items1[1]];

        fixture.componentInstance.select2.multiple = true;
        fixture.componentInstance.select2.items = items1;
        fixture.componentInstance.select2.formControl.setValue([items1[0], items1[1]]);

        fixture.componentInstance.select3.multiple = true;
        fixture.componentInstance.select3.items = items1;
        fixture.componentInstance.select3.value = [items1[0], items1[1]];

        fixture.detectChanges();
        tick();
        fixture.detectChanges();
      }));

      it('by the active attribute', () => {
        expect(selectedItems(1)[0].querySelector('span').innerHTML).toBe(items1[0].text);
        expect(selectedItems(1)[1].querySelector('span').innerHTML).toBe(items1[1].text);
      });

      it('by a FormControl attribute', () => {
        expect(selectedItems(2)[0].querySelector('span').innerHTML).toBe(items1[0].text);
        expect(selectedItems(2)[1].querySelector('span').innerHTML).toBe(items1[1].text);
      });

      it('by a ngModel attribute', () => {
        expect(selectedItems(3)[0].querySelector('span').innerHTML).toBe(items1[0].text);
        expect(selectedItems(3)[1].querySelector('span').innerHTML).toBe(items1[1].text);
      });
    });

    describe('for single select with lazy loading items', () => {
      beforeEach(fakeAsync(() => {
        const lazyItems = [];

        fixture.componentInstance.select1.multiple = false;
        fixture.componentInstance.select1.items = lazyItems;
        fixture.componentInstance.select1.active = [items1[1]];

        fixture.componentInstance.select2.multiple = false;
        fixture.componentInstance.select2.items = lazyItems;
        fixture.componentInstance.select2.formControl.setValue([items1[1]]);

        fixture.componentInstance.select3.multiple = false;
        fixture.componentInstance.select3.items = lazyItems;
        fixture.componentInstance.select3.value = [items1[1]];

        fixture.detectChanges();
        setTimeout(() => items1.forEach(item => lazyItems.push(item)), 2000);
        tick(2100);
        fixture.detectChanges();
      }));

      it('by the active attribute and selected item must be active in menu', () => {
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

      it('by a ngModel attribute and selected item must be active in menu', () => {
        expect(selectedItem(3).innerHTML).toBe(items1[1].text);
        formControl(3).click();
        fixture.detectChanges();
        expect(selectChoiceActive(3).innerHTML).toBe(items1[1].text);
      });

      afterEach(() => {
        // expect(fixture.componentInstance.component1.itemObjects.length).toBeGreaterThan(0);
        // expect(fixture.componentInstance.component2.itemObjects.length).toBeGreaterThan(0);
        // expect(fixture.componentInstance.component3.itemObjects.length).toBeGreaterThan(0);
      });
    });

    describe('for multiple select with lazy loading items', () => {
      beforeEach(fakeAsync(() => {
        const lazyItems = [];

        fixture.componentInstance.select1.multiple = true;
        fixture.componentInstance.select1.items = lazyItems;
        fixture.componentInstance.select1.active = [items1[0], items1[1]];

        fixture.componentInstance.select2.multiple = true;
        fixture.componentInstance.select2.items = lazyItems;
        fixture.componentInstance.select2.formControl.setValue([items1[0], items1[1]]);

        fixture.componentInstance.select3.multiple = true;
        fixture.componentInstance.select3.items = lazyItems;
        fixture.componentInstance.select3.value = [items1[0], items1[1]];

        fixture.detectChanges();
        setTimeout(() => items1.forEach(item => lazyItems.push(item)), 2000);
        tick(2100);
        fixture.detectChanges();
      }));

      it('by the active attribute', () => {
        expect(selectedItems(1)[0].querySelector('span').innerHTML).toBe(items1[0].text);
        expect(selectedItems(1)[1].querySelector('span').innerHTML).toBe(items1[1].text);
      });

      it('by a FormControl attribute', () => {
        expect(selectedItems(2)[0].querySelector('span').innerHTML).toBe(items1[0].text);
        expect(selectedItems(2)[1].querySelector('span').innerHTML).toBe(items1[1].text);
      });

      it('by a ngModel attribute', () => {
        expect(selectedItems(3)[0].querySelector('span').innerHTML).toBe(items1[0].text);
        expect(selectedItems(3)[1].querySelector('span').innerHTML).toBe(items1[1].text);
      });
    });
  });

});
