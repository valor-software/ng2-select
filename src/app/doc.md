### Usage
```typescript
import {NgxSelectModule} from 'ng2-select-ex';
```

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
