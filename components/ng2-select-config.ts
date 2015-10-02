export enum Ng2SelectTheme {BS3 = 1, BS4 = 2}

export class Ng2SelectConfig {
  private static _theme: Ng2SelectTheme;
  static get theme():Ng2SelectTheme {
    // hack as for now
    let w: any = window;
    if (w && w.__theme === 'bs4') {
      return Ng2SelectTheme.BS4;
    }
    return (this._theme || Ng2SelectTheme.BS3);
  }
  static set theme(v:Ng2SelectTheme){
    this._theme = v;
  }
}
