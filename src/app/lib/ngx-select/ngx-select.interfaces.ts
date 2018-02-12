export type TNgxSelectOptionType = 'option' | 'optgroup';

export interface INgxSelectOptionBase {
    type: TNgxSelectOptionType;
}

export interface INgxSelectOption {
    value: number | string;
    text: string;
    disabled: boolean;
}

export interface INgxSelectOptGroup {
    label: string;
    options: INgxSelectOption[];
}
