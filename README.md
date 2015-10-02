# ng2-select

Native Select Angular2 component

## Quick start

1. A recommended way to install ***ng2-select*** is through [npm](https://www.npmjs.com/search?q=ng2-select) package manager using the following command:

  `npm i ng2-select --save`

  Alternatively, you can [download it in a ZIP file](https://github.com/valor-software/ng2-select/archive/master.zip).

2. More information regardidocng using of ***ng2-select*** is located in
  [demo](http://valor-software.github.io/ng2-select/) and [demo sources](https://github.com/valor-software/ng2-select/tree/master/demo).

## API

### Properties

  - `items` - (`Array<any>`) - Array of items from which to select. Should be an array of objects with `id` and `text` properties.
  As convenience, you may also pass an array of strings, in which case the same string is used for both the ID and the text.
  Items may be nested by adding a `children` property to any item, whose value should be another array of items. Items that have children may omit having an ID.
  If `items` are specified, all items are expected to be available locally and all selection operations operate on this local array only.
  If omitted, items are not available locally, and the `query` option should be provided to fetch data.
  - `allowClear` (`?boolean=false`) (*not yet supported*) - Set to `true` to allow the selection to be cleared. This option only applies to single-value inputs.
  - `placeholder` (`?string=''`) - Placeholder text to display when the element has no focus and selected items.
  - `multiple` - (`?boolean=false`) - Mode of this component. If set `true` user can select more than one option.
  - `showSearchInputInDropdown` - (`?boolean=true`) (*not yet supported*) - Set to `false` to remove the search input used in dropdowns.
  This option only applies to single-value inputs, as multiple-value inputs don't have the search input in the dropdown to begin with.

# Troubleshooting

Please follow this guidelines when reporting bugs and feature requests:

1. Use [GitHub Issues](https://github.com/valor-software/ng2-select/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

### License

The MIT License (see the [LICENSE](https://github.com/valor-software/ng2-select/blob/master/LICENSE) file for the full text)