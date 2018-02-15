import {Directive, TemplateRef} from '@angular/core';

@Directive({selector: '[ngx-select-option]'})
export class NgxSelectOptionDirective {
    constructor(public template: TemplateRef<any>) {
    }
}

@Directive({selector: '[ngx-select-option-selected]'})
export class NgxSelectOptionSelectedDirective {
    constructor(public template: TemplateRef<any>) {
    }
}

@Directive({selector: '[ngx-select-option-not-found]'})
export class NgxSelectOptionNotFoundDirective {
    constructor(public template: TemplateRef<any>) {
    }
}
