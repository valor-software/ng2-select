import { ISelectItem } from './select.interfaces';

/**
 * @deprecated
 */
export class SelectItem implements ISelectItem {
  public id: number | string;
  public text: string;
  public children: SelectItem[];
  public parent: SelectItem;

  public constructor(source: string | ISelectItem) {
    if (typeof source === 'string') {
      this.id = this.text = source;
    }
    if (typeof source === 'object' && source !== null) {
      this.id = typeof source.id === 'undefined' ? source.text : source.id;
      this.text = source.text;
      if (source.children && source.text) {
        this.children = [].concat(source.children).map((c: any) => {
          const r: SelectItem = new SelectItem(c);
          r.parent = this;
          return r;
        });
      }
    }
  }

  public fillChildrenHash(optionsMap: Map<string | number, number>, startIndex: number): number {
    let i = startIndex;
    this.children.map((child: SelectItem) => {
      optionsMap.set(child.id, i++);
    });
    return i;
  }

  public hasChildren(): boolean {
    return this.children && this.children.length > 0;
  }

  public getSimilar(): SelectItem {
    const result: SelectItem = new SelectItem({id: this.id, text: this.text});
    result.parent = this.parent;
    return result;
  }
}
