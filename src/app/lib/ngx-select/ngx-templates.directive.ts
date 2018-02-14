import {Directive, TemplateRef} from '@angular/core';

@Directive({selector: '[ngx-select-option]'})
export class NgxSelectOptionDirective {
    constructor(public template: TemplateRef<any>) {
    }
}
