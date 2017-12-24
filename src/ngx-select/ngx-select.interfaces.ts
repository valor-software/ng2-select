export interface INgxSelectOptionBase {
  type: 'option' | 'optgroup';
}

export interface INgxSelectOption {
  value: number | string;
  text: string;
}

export interface INgxSelectOptGroup {
  label: string;
  options: INgxSelectOption[];
}
