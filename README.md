# Native UI Select Angular component ([demo](http://valor-software.com/ng2-select/))
## ng2-select [![npm version](https://badge.fury.io/js/ng2-select.svg)](http://badge.fury.io/js/ng2-select) [![npm downloads](https://img.shields.io/npm/dm/ng2-select.svg)](https://npmjs.org/ng2-select)[![slack](https://ngx-slack.herokuapp.com/badge.svg)](https://ngx-slack.herokuapp.com)

[![Angular 2 Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://github.com/mgechev/angular2-style-guide)
[![Build Status](https://travis-ci.org/valor-software/ng2-select.svg?branch=development)](https://travis-ci.org/valor-software/ng2-select)

## Quick start

1. A recommended way to install ***ng2-select*** is through [npm](https://www.npmjs.com/search?q=ng2-select) package manager using the following command:

  `npm i ng2-select --save`

2. Include `ng2-select.css` in your project

3. More information regarding of using ***ng2-select*** is located in
  [demo](http://valor-software.github.io/ng2-select/) and [demo sources](https://github.com/valor-software/ng2-select/tree/master/demo).

## API

### Properties

  - `items` - (`Array<any>`) - Array of items from which to select. Should be an array of objects with `id` and `text` properties.
  As convenience, you may also pass an array of strings, in which case the same string is used for both the ID and the text.
  Items may be nested by adding a `children` property to any item, whose value should be another array of items. Items that have children may omit having an ID.
  If `items` are specified, all items are expected to be available locally and all selection operations operate on this local array only.
  If omitted, items are not available locally, and the `query` option should be provided to fetch data.
  - `active` (`?Array<any>`) - selection data to set. This should be an object with `id` and `text` properties in the case of input type 'Single',
  or an array of such objects otherwise. This option is mutually exclusive with value.
  - `allowClear` (`?boolean=false`) (*not yet supported*) - Set to `true` to allow the selection to be cleared. This option only applies to single-value inputs.
  - `placeholder` (`?string=''`) - Placeholder text to display when the element has no focus and selected items.
  - `disabled` (`?boolean=false`) - When `true`, it specifies that the component should be disabled.
  - `multiple` - (`?boolean=false`) - Mode of this component. If set `true` user can select more than one option.
  This option only applies to single-value inputs, as multiple-value inputs don't have the search input in the dropdown to begin with.

### Events

  - `data` - it fires during all events of this component; returns `Array<any>` - current selected data
  - `selected` - it fires after a new option selected; returns object with `id` and `text` properties that describes a new option.
  - `removed` - it fires after an option removed; returns object with `id` and `text` properties that describes a removed option.
  - `typed` - it fires after changing of search input; returns `string` with that value.

# Troubleshooting

Please follow this guidelines when reporting bugs and feature requests:

1. Use [GitHub Issues](https://github.com/valor-software/ng2-select/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

### License

The MIT License (see the [LICENSE](https://github.com/valor-software/ng2-select/blob/master/LICENSE) file for the full text)
