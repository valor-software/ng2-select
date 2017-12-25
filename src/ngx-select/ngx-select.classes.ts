import { INgxSelectOptGroup, INgxSelectOption, INgxSelectOptionBase } from './ngx-select.interfaces';

export class NgxSelectOption implements INgxSelectOption, INgxSelectOptionBase {
  readonly type = 'option';

  constructor(public value: number | string,
              public text: string,
              private _parent: NgxSelectOptGroup = null) {
  }

  public get parent(): NgxSelectOptGroup {
    return this._parent;
  }
}

export class NgxSelectOptGroup implements INgxSelectOptGroup, INgxSelectOptionBase {
  readonly type = 'optgroup';

  constructor(public label: string,
              public options: Array<NgxSelectOption> = []) {
  }
}
