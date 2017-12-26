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

  public optionsFiltered: NgxSelectOption[];

  constructor(public label: string,
              public options: NgxSelectOption[] = []) {
    this.filter(() => true);
  }

  public filter(callbackFn: (value: NgxSelectOption) => any): void {
    this.optionsFiltered = this.options.filter((option: NgxSelectOption) => callbackFn(option));
  }
}
