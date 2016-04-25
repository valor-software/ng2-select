export class SelectItem {
  public id:string;
  public text:string;
  public children:Array<SelectItem>;
  public parent:SelectItem;

  constructor(source:any, idProperty: string, textProperty: string, childrenProperty: string) {
    if (source) {
      if (typeof source === 'string') {
        this.id = this.text = source;
      }

      if (typeof source === 'object') {
        this.id = source[idProperty] || source[textProperty];
        this.text = source[textProperty];

        if (source[childrenProperty] && source[textProperty]) {
          this.children = source[childrenProperty].map((c: any) => {
            let r: SelectItem = new SelectItem(c, idProperty, textProperty, '');
            r.parent = this;
            return r;
          });
          this.text = source[textProperty];
        }
      }
    }
  }

  public fillChildrenHash(optionsMap:Map<string, number>, startIndex:number):number {
    let i = startIndex;
    this.children.map(child => {
      optionsMap.set(child.id, i++);
    });

    return i;
  }

  public hasChildren():boolean {
    return this.children && this.children.length > 0;
  }

  public getSimilar():SelectItem {
    let r:SelectItem = new SelectItem(null, '', '', '');
    r.id = this.id;
    r.text = this.text;
    r.parent = this.parent;
    return r;
  }
}
