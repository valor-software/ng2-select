import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngx-select-option]',
  standalone: false
})
export class NgxSelectOptionDirective {
    constructor(public template: TemplateRef<any>) {
    }
}

@Directive({
  selector: '[ngx-select-option-selected]',
  standalone: false
})
export class NgxSelectOptionSelectedDirective {
    constructor(public template: TemplateRef<any>) {
    }
}

@Directive({
  selector: '[ngx-select-option-not-found]',
  standalone: false
})
export class NgxSelectOptionNotFoundDirective {
    constructor(public template: TemplateRef<any>) {
    }
}
