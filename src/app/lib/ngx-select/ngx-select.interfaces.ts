import {NgxSelectOption, TSelectOption} from './ngx-select.classes';

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
    filteredOptionList: TSelectOption[];
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
    keepSelectedItems: boolean;
    size?: 'small' | 'default' | 'large';
    keyCodeToRemoveSelected?: string;
    keyCodeToOptionsOpen?: string | string[];
    keyCodeToOptionsClose?: string;
    keyCodeToOptionsSelect?: string | string[];
    keyCodeToNavigateFirst?: string;
    keyCodeToNavigatePrevious?: string;
    keyCodeToNavigateNext?: string;
    keyCodeToNavigateLast?: string;
}
