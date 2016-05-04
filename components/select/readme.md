### Usage
```typescript
import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';
```

### Annotations
```typescript
// class Select
@Component({
  selector: 'ng-select',
  properties: [
    'allowClear',
    'placeholder',
    'items',
    'multiple',
    'showSearchInputInDropdown']
})
```

### Select properties

  - `items` - (`Array<any>`) - Array of items from which to select. Should be an array of objects with `id` and `text` properties.
  As convenience, you may also pass an array of strings, in which case the same string is used for both the ID and the text.
  Items may be nested by adding a `children` property to any item, whose value should be another array of items. Items that have children may omit having an ID.
  If `items` are specified, all items are expected to be available locally and all selection operations operate on this local array only.
  If omitted, items are not available locally, and the `query` option should be provided to fetch data.
  - `data` (`?Array<any>`) - Initial selection data to set. This should be an object with `id` and `text` properties in the case of input type 'Single',
  or an array of such objects otherwise. This option is mutually exclusive with value.
  - `allowClear` (`?boolean=false`) (*not yet supported*) - Set to `true` to allow the selection to be cleared. This option only applies to single-value inputs.
  - `placeholder` (`?string=''`) - Placeholder text to display when the element has no focus and selected items.
  - `disabled` (`?boolean=false`) - When `true`, it specifies that the component should be disabled.
  - `multiple` - (`?boolean=false`) - Mode of this component. If set `true` user can select more than one option.
  This option only applies to single-value inputs, as multiple-value inputs don't have the search input in the dropdown to begin with.

### Select events

  - `data` - it fires during all events of this component; returns `Array<any>` - current selected data
  - `selected` - it fires after a new option selected; returns object with `id` and `text` properties that describes a new option.
  - `removed` - it fires after an option removed; returns object with `id` and `text` properties that describes a removed option.
  - `typed` - it fires after changing of search input; returns `string` with that value.
