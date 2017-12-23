export interface ISelectOption {
  value?: number | string;
  text?: string;
}

export interface ISelectOptGroup {
  label?: string;
  options?: ISelectOption;
}
