# Native UI Select Angular component

## Description

This is a library based on a fork from [ng2-select](https://github.com/valor-software/ng2-select).
We would love any PRs if you have enhancements in mind. We intend on maintaining this library for a while and in the event that our organization does not need this
library anymore and/or we become too busy to maintain it we are open to adding other co-maintainers.

## Quick start

1. A recommended way to install ***ng-next-select*** is through [npm](https://www.npmjs.com/search?q=ng-next-select) package manager using the following command:

  `npm i ng-next-select --save`

2. Include `ng-next-select.css` in your project

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

1. Use [GitHub Issues](https://github.com/psilospore/ng-next-select/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

# Migration from Valor's ng2-select

1. Import our library in your package.json instead of ng2-select 
2. Rename ng2-select.css to ng-next-select.css

That's it

### License

The MIT License (see the [LICENSE](https://github.com/psilospore/ng-next-select/blob/master/LICENSE) file for the full text)
