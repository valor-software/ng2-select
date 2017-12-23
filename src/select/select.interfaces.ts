export interface ISelectItem {
  id?: number | string;
  text?: string;
  children?: ISelectItem[];
}
