## Usage

1. Install **ngx-select-ex** through [npm](https://www.npmjs.com/package/ngx-select-ex) package manager using the following command:

    ```bash
    npm i ngx-select-ex --save
    ```

    For usage with Angular 4 install using the following command:

    ```bash
    npm i ngx-select-ex@ng4 --save
    ```

2. Add NgxSelectModule into your AppModule class. app.module.ts would look like this:

    ```typescript
    import {NgModule} from '@angular/core';
    import {BrowserModule} from '@angular/platform-browser';
    import {AppComponent} from './app.component';
    import { NgxSelectModule } from 'ngx-select-ex';

    @NgModule({
      imports: [BrowserModule, NgxSelectModule],
      declarations: [AppComponent],
      bootstrap: [AppComponent],
    })
    export class AppModule {
    }
    ```
    
    If you want to change the default options then use next code:
    ```typescript
    import {NgModule} from '@angular/core';
    import {BrowserModule} from '@angular/platform-browser';
    import {AppComponent} from './app.component';
    import { NgxSelectModule, INgxSelectOptions } from 'ngx-select-ex';
 
    const CustomSelectOptions: INgxSelectOptions = { // Check the interface for more options
        optionValueField: 'id',
        optionTextField: 'name'
    };

    @NgModule({
      imports: [BrowserModule, NgxSelectModule.forRoot(CustomSelectOptions)],
      declarations: [AppComponent],
      bootstrap: [AppComponent],
    })
    export class AppModule {
    }
    ```
    
3. Include Bootstrap styles.
    For example add to your index.html

    ```html
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    ```

4. Add the tag `<ngx-select>` into some html

    ```html
    <ngx-select [items]="items" [(ngModel)]="itemId">
    ```

5. More information regarding of using **ngx-select-ex** is located in [demo](https://optimistex.github.io/ngx-select-ex/).

## API

Any item can be `disabled` for prevent selection. For disable an item add the property `disabled` to the item.

| Input  | Type | Default |  Description |
| -------- | -------- | -------- |  ------------- |
| [items] | any[] | `[]` |   Items array. Should be an array of objects with `id` and `text` properties. As convenience, you may also pass an array of strings, in which case the same string is used for both the ID and the text. Items may be nested by adding a `options` property to any item, whose value should be another array of items. Items that have children may omit to have an ID. |
| optionValueField | string | `'id'` |  Provide an opportunity to change the name an `id` property of objects in the `items`  |
| optionTextField | string | `'text'` |  Provide an opportunity to change the name a `text` property of objects in the `items` |
| optGroupLabelField | string | `'label'` |  Provide an opportunity to change the name a `label` property of objects with an `options` property in the `items` |
| optGroupOptionsField | string | `'options'` |  Provide an opportunity to change the name of an `options` property of objects in the `items` |
| [multiple] | boolean | `false` |  Mode of this component. If set `true` user can select more than one option |
| [allowClear] | boolean | `false` |  Set to `true` to allow the selection to be cleared. This option only applies to single-value inputs |
| [placeholder] | string | `''` |  Set to `true` Placeholder text to display when the element has no focus and selected items |
| [noAutoComplete] | boolean | `false` |  Set to `true` Set to `true` to hide the search input. This option only applies to single-value inputs |
| [keepSelectedItems] | boolean | `false` | Storing the selected items when the item list is changed |
| [disabled] | boolean | `false` |  When `true`, it specifies that the component should be disabled |
| [defaultValue] | any[] | `[]` |  Use to set default value |
| autoSelectSingleOption | boolean | `false` | Auto select a non disabled single option |
| autoClearSearch | boolean | `false` | Auto clear a search text after select an option. Has effect for `multiple = true` |
| noResultsFound | string | `'No results found'` | The default text showed when a search has no results |
| size | `'small'/'default'/'large'` | `'default'` | Adding bootstrap classes: form-control-sm, input-sm, form-control-lg input-lg, btn-sm, btn-lg |
| searchCallback | `(search: string, item: INgxSelectOption) => boolean` | `null` | The callback function for custom filtering the select list |

| Output  | Description |
| ------------- | ------------- |
| (typed)  | Fired on changing search input. Returns `string` with that value. |
| (focus)  | Fired on select focus |
| (blur)  | Fired on select blur |
| (open)  | Fired on select dropdown open |
| (close)  | Fired on select dropdown close |
| (select)  | Fired on an item selected by user. Returns value of the selected item. |
| (remove)  | Fired on an item removed by user. Returns value of the removed item. |
| (navigated)  | Fired on navigate by the dropdown list. Returns: `INgxOptionNavigated`. |
| (selectionChanges)  | Fired on change selected options. Returns: `INgxSelectOption[]`. |

**Warning!** Although the component contains the `select` and the `remove` events, the better solution is using `valueChanges` of the `FormControl`.

```typescript
import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-example',
    template: `<ngx-select [items]="['111', '222']" [formControl]="selectControl"></ngx-select>`
})
class ExampleComponent {
    public selectControl = new FormControl();
    
    constructor() {
        this.selectControl.valueChanges.subscribe(value => console.log(value));
    }
}
```

### Styles and customization

Currently, the component contains CSS classes named within [BEM Methodology](https://en.bem.info/methodology/).
As well it contains the "Bootstrap classes". Recommended use BEM classes for style customization.

List of styles for customization:

- **`ngx-select`** - Main class of the component.
- **`ngx-select_multiple`** - Modifier of the multiple mode. It's available when the property multiple  is true.
- **`ngx-select__disabled`** - Layer for the disabled mode.
- **`ngx-select__selected`** - The common container for displaying selected items.
- **`ngx-select__toggle`** - The toggle for single mode. It's available when the property multiple  is false.
- **`ngx-select__placeholder`** - The placeholder item. It's available when the property multiple  is false.
- **`ngx-select__selected-single`** - The selected item with single mode. It's available when the property multiple  is false.
- **`ngx-select__selected-plural`** - The multiple selected item. It's available when the property multiple is true.
- **`ngx-select__allow-clear`** - The indicator that the selected single item can be removed. It's available while properties the multiple is false and the allowClear is true.
- **`ngx-select__toggle-buttons`** - The container of buttons such as the clear and the toggle.
- **`ngx-select__toggle-caret`** - The drop-down button of the single mode. It's available when the property multiple  is false.
- **`ngx-select__clear`** - The button clear.
- **`ngx-select__clear-icon`** - The cross icon.
- **`ngx-select__search`** - The input field for full text lives searching.
- **`ngx-select__choices`** - The common container of items.
- **`ngx-select__item-group`** - The group of items.
- **`ngx-select__item`** - An item.
- **`ngx-select__item_disabled`** - Modifier of a disabled item.
- **`ngx-select__item_active`** - Modifier of the activated item.

### Templates

For extended rendering customisation you are can use the `ng-template`:

```html
<ngx-select [items]="items" optionValueField="hex" optionTextField="name" [(ngModel)]="ngxValue">

    <ng-template ngx-select-option-selected let-option let-text="text">
        <span class="color-box" [style]="style('background-color:' + option.value)"></span>
        <span [innerHtml]="text"></span>
        ({{option.data.hex}})
    </ng-template>

    <ng-template ngx-select-option let-option let-text="text">
        <span class="color-box" [style]="style('background-color:' + option.value)"></span>
        <span [innerHtml]="text"></span>
        ({{option.data.hex}})
    </ng-template>

    <ng-template ngx-select-option-not-found>
        Nothing found
    </ng-template>

</ngx-select>
``` 

Also, you are can mix directives for reducing template:
```html
<ngx-select [items]="items" optionValueField="hex" optionTextField="name" [(ngModel)]="ngxValue">
    <ng-template ngx-select-option-selected ngx-select-option let-option let-text="text">
        <span class="color-box" [style]="style('background-color:' + option.value)"></span>
        <span [innerHtml]="text"></span>
        ({{option.data.hex}})
    </ng-template>

    <ng-template ngx-select-option-not-found>
        Not found <button (click)="addItem()">(+) Add new item</button>
    </ng-template>
</ngx-select>
``` 

Description details of the directives:
1. `ngx-select-option-selected` - Customization rendering selected options.
    Representing variables:
    - `option` (implicit) - object of type `INgxSelectOption`.
    - `text` - The text defined by the property `optionTextField`.
    - `index` - Number value of index the option in the select list. Always equal to zero for the single select. 
2. `ngx-select-option` - Customization rendering options in the dropdown menu.
    Representing variables:
    - `option` (implicit) - object of type `INgxSelectOption`.
    - `text` - The highlighted text defined by the property `optionTextField`. It is highlighted in the search. 
    - `index` - Number value of index for the top level.  
    - `subIndex` - Number value of index for the second level.
3. `ngx-select-option-not-found` - Customization "not found text". Does not represent any variables.
