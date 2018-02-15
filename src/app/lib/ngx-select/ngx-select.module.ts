import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxSelectComponent} from './ngx-select.component';
import {NgxSelectOptionDirective, NgxSelectOptionNotFoundDirective, NgxSelectOptionSelectedDirective} from './ngx-templates.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [NgxSelectComponent,
        NgxSelectOptionDirective, NgxSelectOptionSelectedDirective, NgxSelectOptionNotFoundDirective
    ],
    exports: [NgxSelectComponent,
        NgxSelectOptionDirective, NgxSelectOptionSelectedDirective, NgxSelectOptionNotFoundDirective
    ]
})
export class NgxSelectModule {
}
