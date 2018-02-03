# Native UI Select Angular component ([demo](https://optimistex.github.io/ng2-select-ex/))
## ng2-select-ex 
[![npm version](https://badge.fury.io/js/ng2-select-ex.svg)](http://badge.fury.io/js/ng2-select-ex) 
[![npm downloads](https://img.shields.io/npm/dm/ng2-select-ex.svg)](https://npmjs.org/ng2-select-ex)
[![Build Status](https://travis-ci.org/optimistex/ng2-select-ex.svg?branch=master)](https://travis-ci.org/optimistex/ng2-select-ex)
[![Angular 2 Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://github.com/mgechev/angular2-style-guide)

Native Angular2 component for Select

Compatible with [Bootstrap 3](https://getbootstrap.com/docs/3.3/) and **[Bootstrap 4](https://getbootstrap.com/)**

## Usage

1. Install **ng2-select-ex** through [npm](https://www.npmjs.com/package/ng2-select-ex) package manager using the following command:

    ```console
    npm i ng2-select-ex --save
    ```

2. Add NgxSelectModule into your AppModule class. app.module.ts would look like this:

    ```typescript
    import {NgModule} from '@angular/core';
    import {BrowserModule} from '@angular/platform-browser';
    import {AppComponent} from './app.component';
    import { NgxSelectModule } from 'ng2-select-ex';
    
    @NgModule({
      imports: [BrowserModule, NgxSelectModule],
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

4. Add the tag <ngx-select> into some html 

    ```html
    <ngx-select [items]="items" [(ngModel)]="itemId">
    ```

5. More information regarding of using **ng2-select-ex** is located in [demo](https://optimistex.github.io/ng2-select-ex/).

## API

### Properties

  - **`items: any[]`** - (by default `[]`) - Array of items from which to select. Should be an array of objects with `id` and `text` properties.
  As convenience, you may also pass an array of strings, in which case the same string is used for both the ID and the text.
  Items may be nested by adding a `options` property to any item, whose value should be another array of items. Items that have children may omit to have an ID.
  - **`optionValueField: string`** - (by default `'id'`) - Provide an opportunity to change the name an `id` property of objects in the `items`.
  - **`optionTextField: string`** - (by default `'text'`) - Provide an opportunity to change the name a `text` property of objects in the `items`.
  - **`optGroupLabelField: string`** - (by default `'label'`) - Provide an opportunity to change the name a `label` property of objects with an `options` property in the `items`.
  - **`optGroupOptionsField: string`** - (by default `'options'`) - Provide an opportunity to change the name of an `options` property of objects in the `items`.
  - **`multiple: boolean`** - (by default `false`) - Mode of this component. If set `true` user can select more than one option.
  - **`allowClear: boolean`** - (by default `false`) - Set to `true` to allow the selection to be cleared. This option only applies to single-value inputs.
  - **`placeholder: string`** - (by default `''`) - Placeholder text to display when the element has no focus and selected items.
  - **`noAutoComplete: boolean`** - (by default `false`) - Set to `true` to hide the search input. This option only applies to single-value inputs.
  - **`disabled: boolean`** - (by default `false`) - When `true`, it specifies that the component should be disabled.
  - **`defaultValue: any|any[]`** - (by default `[]`) - Use to set default value.

### Events

  - **`typed`** - It is fired after changing of search input. Returns `string` with that value.
  - **`focus`** - It is fired after getting focus.
  - **`blur`** - It is fired after lost focus.

# Troubleshooting

Please follow this guidelines when reporting bugs and feature requests:

1. Use [GitHub Issues](https://github.com/optimistex/ng2-select-ex/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

### License

The MIT License (see the [LICENSE](https://github.com/optimistex/ng2-select-ex/blob/master/LICENSE) file for the full text)
