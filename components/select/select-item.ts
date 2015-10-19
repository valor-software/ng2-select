export class SelectItem {
  public id:string;
  public text:string;
  public children:Array<SelectItem>;
  public parent:SelectItem;

  constructor(source:any) {
    if (typeof source === 'string') {
      this.id = this.text = source;
    }

    if (typeof source === 'object') {
      this.id = source.id || source.text;
      this.text = source.text;

      if (source.children && source.text) {
        this.children = source.children.map((c:any) => {
          let r:SelectItem = new SelectItem(c);
          r.parent = this;
          return r;
        });
        this.text = source.text;
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
    let r:SelectItem = new SelectItem(false);
    r.id = this.id;
    r.text = this.text;
    r.parent = this.parent;
    return r;
  }
}
