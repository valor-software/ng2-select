import {async, fakeAsync, tick, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, ViewChild} from '@angular/core';

import {SelectModule, SelectComponent} from '../ng2-select';

@Component({
    selector: 'select-test',
    template: `
        <ng-select id="sel-1" #component1
                   [allowClear]="allowClear"
                   [placeholder]="placeholder"
                   [textField]="textField"
                   [childrenField]="childrenField"
                   [multiple]="multiple"
                   [noAutoComplete]="noAutoComplete"
                   [items]="items"
                   [disabled]="disabled"
                   [active]="active"

                   (data)="data($event)"
                   (selected)="selected($event)"
                   (removed)="removed($event)"
                   (typed)="typed($event)"
                   (opened)="opened($event)"></ng-select>
        <ng-select id="sel-2" #component2></ng-select>
        <ng-select id="sel-3" #component3 [multiple]="true"></ng-select>`
})
class TestSelectComponent {
    @ViewChild('component1') component1: SelectComponent;
    @ViewChild('component2') component2: SelectComponent;
    @ViewChild('component3') component3: SelectComponent;

    public allowClear: boolean;     // +
    public placeholder: string;
    public idField: string;
    public textField: string;
    public childrenField: string;
    public multiple: boolean;       // +
    public noAutoComplete: boolean; // +
    public items: any[];            // +
    public disabled: boolean;       // +
    public active: any[];

    public data = (v: any) => console.log('data', v);
    public selected = (v: any) => console.log('selected', v);
    public removed = (v: any) => console.log('removed', v);
    public typed = (v: any) => console.log('typed', v);
    public opened = (v: any) => console.log('opened', v);
}

describe('Component: ng2-select', () => {
    let fixture: ComponentFixture<TestSelectComponent>;
    const el = (id: number) => fixture.debugElement.nativeElement.querySelector(`#sel-${id} .ui-select-container`);
    const formControl = (id: number) => el(id).querySelector('.form-control');
    const formControlInput = (id: number) => el(id).querySelector('input');
    const selectChoices = (id: number) => el(id).querySelectorAll('.ui-select-choices-row');
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
            imports: [SelectModule],
            declarations: [TestSelectComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestSelectComponent);

        fixture.componentInstance.allowClear = false;
        fixture.componentInstance.placeholder = '';
        fixture.componentInstance.idField = 'id';
        fixture.componentInstance.textField = 'text';
        fixture.componentInstance.childrenField = 'children';
        fixture.componentInstance.multiple = false;
        fixture.componentInstance.noAutoComplete = false;
        // fixture.componentInstance.items = ;
        fixture.componentInstance.disabled = false;
        fixture.componentInstance.active = [];

        spyOn(fixture.componentInstance, 'data').and.callThrough();
        spyOn(fixture.componentInstance, 'selected').and.callThrough();
        spyOn(fixture.componentInstance, 'removed').and.callThrough();
        spyOn(fixture.componentInstance, 'typed').and.callThrough();
        spyOn(fixture.componentInstance, 'opened').and.callThrough();

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

        expect(fixture.componentInstance.data).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.selected).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.removed).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.typed).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.opened).toHaveBeenCalledTimes(0);
    });

    it('test default properties', () => {
        expect(fixture.componentInstance.component2.allowClear).toBeFalsy();
        expect(fixture.componentInstance.component2.placeholder).toEqual('');
        expect(fixture.componentInstance.component2.idField).toBe('id');
        expect(fixture.componentInstance.component2.textField).toBe('text');
        expect(fixture.componentInstance.component2.childrenField).toBe('children');
        expect(fixture.componentInstance.component2.multiple).toBeFalsy();
        expect(fixture.componentInstance.component2.noAutoComplete).toBeFalsy();
        expect(fixture.componentInstance.component2.items).toBeUndefined();
        expect(fixture.componentInstance.component2.disabled).toBeFalsy();
        expect(fixture.componentInstance.component2.active).toEqual([]);

        expect(fixture.componentInstance.data).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.selected).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.removed).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.typed).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.opened).toHaveBeenCalledTimes(0);
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
        fixture.componentInstance.items = items1;
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

        expect(fixture.componentInstance.data).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.selected).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.removed).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.typed).toHaveBeenCalledTimes(0);
        expect(fixture.componentInstance.opened).toHaveBeenCalledTimes(4);
    });

    it('should have not auto complete', () => {
        fixture.componentInstance.noAutoComplete = true;
        fixture.detectChanges();
        formControl(1).click();
        fixture.detectChanges();
        expect(formControlInput(1)).toBeFalsy();
    });

    describe('should be focused', () => {
        beforeEach(() => {
            fixture.componentInstance.items = items1;
        });

        it('single', () => {
            fixture.componentInstance.multiple = false;
        });

        it('multiple', () => {
            fixture.componentInstance.multiple = true;
        });

        afterEach(() => {
            formControl(1).click();
            fixture.detectChanges();
            fixture.detectChanges();
            expect(formControlInput(1)).toBeTruthy();
            expect(formControlInput(1).value).toBe('');
            expect(formControlInput(1)).toBe(document.activeElement);

            expect(fixture.componentInstance.data).toHaveBeenCalledTimes(0);
            expect(fixture.componentInstance.selected).toHaveBeenCalledTimes(0);
            expect(fixture.componentInstance.removed).toHaveBeenCalledTimes(0);
            expect(fixture.componentInstance.typed).toHaveBeenCalledTimes(0);
            expect(fixture.componentInstance.opened).toHaveBeenCalledTimes(1);
        });
    });

    describe('should selecting items and clean it', () => {
        it('single', () => {
            expect(formControlInput(1)).toBeFalsy();
            expect(selectedItem(1)).toBeFalsy();

            fixture.componentInstance.items = items1;
            fixture.detectChanges();
            formControl(1).click();
            fixture.detectChanges();
            expect(formControlInput(1)).toBeTruthy();
            expect(formControlInput(1).value).toBe('');
            expect(selectChoices(1).length).toBe(3);
            expect(selectedItem(1)).toBeFalsy();

            selectChoices(1)[0].click();
            fixture.detectChanges();
            expect(formControlInput(1)).toBeFalsy();
            expect(selectedItem(1)).toBeTruthy();
            expect(selectedItem(1).innerHTML).toBe('v1');

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
            expect(el(1).querySelector('.btn-link')).toBeFalsy();

            fixture.componentInstance.allowClear = true;
            fixture.detectChanges();
            expect(el(1).querySelector('.btn-link')).toBeTruthy();

            el(1).querySelector('.btn-link').click();
            fixture.detectChanges();
            expect(formControlInput(1)).toBeFalsy();
            expect(selectedItem(1)).toBeFalsy();
        });

        it('multiple', () => {
            expect(formControlInput(1)).toBeFalsy();
            expect(selectedItems(1).length).toBe(0);

            fixture.componentInstance.items = items1;
            fixture.componentInstance.multiple = true;
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
            expect(fixture.componentInstance.data).toHaveBeenCalledTimes(3);
            expect(fixture.componentInstance.selected).toHaveBeenCalledTimes(2);
            expect(fixture.componentInstance.removed).toHaveBeenCalledTimes(1);
            expect(fixture.componentInstance.typed).toHaveBeenCalledTimes(0);
            expect(fixture.componentInstance.opened).toHaveBeenCalledTimes(4);
        });
    });

    describe('should be searched', () => {
        beforeEach(() => {
            fixture.componentInstance.items = items1;
            fixture.detectChanges();
        });

        it('single', () => {
            fixture.componentInstance.multiple = false;
            fixture.detectChanges();
        });

        it('multiple', () => {
            fixture.componentInstance.multiple = true;
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

            expect(fixture.componentInstance.data).toHaveBeenCalledTimes(0);
            expect(fixture.componentInstance.selected).toHaveBeenCalledTimes(0);
            expect(fixture.componentInstance.removed).toHaveBeenCalledTimes(0);
            expect(fixture.componentInstance.typed).toHaveBeenCalledTimes(2);
            expect(fixture.componentInstance.opened).toHaveBeenCalledTimes(1);
        });
    });

    describe('should be disabled', () => {
        beforeEach(() => {
            fixture.componentInstance.items = items1;
            fixture.componentInstance.disabled = true;
            fixture.detectChanges();
        });

        it('single', () => {
            formControl(1).click();
            fixture.detectChanges();
            expect(formControlInput(1)).toBeFalsy();
            expect(selectChoices(1).length).toBe(0);
        });

        it('multiple', () => {
            fixture.componentInstance.multiple = true;
            fixture.detectChanges();
            formControl(1).click();
            fixture.detectChanges();
            expect(formControlInput(1)).toBeTruthy();
            expect(selectChoices(1).length).toBe(0);
        });

        afterEach(() => {
            fixture.componentInstance.disabled = false;
            fixture.detectChanges();
            expect(fixture.componentInstance.data).toHaveBeenCalledTimes(0);
            expect(fixture.componentInstance.selected).toHaveBeenCalledTimes(0);
            expect(fixture.componentInstance.removed).toHaveBeenCalledTimes(0);
            expect(fixture.componentInstance.typed).toHaveBeenCalledTimes(0);
            expect(fixture.componentInstance.opened).toHaveBeenCalledTimes(0);
        });
    });
});
