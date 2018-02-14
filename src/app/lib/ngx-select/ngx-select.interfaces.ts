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
