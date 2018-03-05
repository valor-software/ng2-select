import {NgxSelectOption} from './ngx-select.classes';

export type TNgxSelectOptionType = 'option' | 'optgroup';

export interface INgxSelectOptionBase {
    type: TNgxSelectOptionType;
}

export interface INgxSelectOption {
    value: number | string;
    text: string;       // text for displaying and searching
    disabled: boolean;
    data: any;          // original data
}

export interface INgxSelectOptGroup {
    label: string;
    options: INgxSelectOption[];
}

export interface INgxOptionNavigated {
    index: number;
    activeOption: NgxSelectOption;
    filteredOptionList: NgxSelectOption[];
}

export interface INgxSelectOptions {
    optionValueField?: string;
    optionTextField?: string;
    optGroupLabelField?: string;
    optGroupOptionsField?: string;
    multiple?: boolean;
    allowClear?: boolean;
    placeholder?: string;
    noAutoComplete?: boolean;
    disabled?: boolean;
    autoSelectSingleOption?: boolean;
    autoClearSearch?: boolean;
    noResultsFound?: string;
}
