import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import * as escapeStringNs from 'escape-string-regexp';
import {INgxSelectOptGroup, INgxSelectOption, INgxSelectOptionBase, TNgxSelectOptionType} from './ngx-select.interfaces';

const escapeString = escapeStringNs;

export class NgxSelectOption implements INgxSelectOption, INgxSelectOptionBase {
    readonly type: TNgxSelectOptionType = 'option';

  highlightedText: SafeHtml;
  active: boolean;

  constructor(public value: number | string,
                public text: string,
                public disabled: boolean,
                public data: any,
                private _parent: NgxSelectOptGroup = null) {
    }

    public get parent(): NgxSelectOptGroup {
        return this._parent;
    }

    private cacheHighlightText: string;
    private cacheRenderedText: SafeHtml = null;

    public renderText(sanitizer: DomSanitizer, highlightText: string): SafeHtml {
        if (this.cacheHighlightText !== highlightText || this.cacheRenderedText === null) {
            this.cacheHighlightText = highlightText;
            if (this.cacheHighlightText) {
                this.cacheRenderedText = sanitizer.bypassSecurityTrustHtml((this.text + '').replace(
                    new RegExp(escapeString(this.cacheHighlightText), 'gi'), '<strong>$&</strong>'
                ));
            } else {
                this.cacheRenderedText = sanitizer.bypassSecurityTrustHtml(this.text);
            }
        }
        return this.cacheRenderedText;
    }
}

export class NgxSelectOptGroup implements INgxSelectOptGroup, INgxSelectOptionBase {
    readonly type: TNgxSelectOptionType = 'optgroup';

    public optionsFiltered: NgxSelectOption[];

    constructor(public label: string,
                public options: NgxSelectOption[] = []) {
        this.filter(() => true);
    }

    public filter(callbackFn: (value: NgxSelectOption) => any): void {
        this.optionsFiltered = this.options.filter((option: NgxSelectOption) => callbackFn(option));
    }
}

export type TSelectOption = NgxSelectOptGroup | NgxSelectOption;
