import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxSelectComponent} from './ngx-select.component';
import {NgxSelectOptionDirective} from './ngx-templates.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [NgxSelectComponent, NgxSelectOptionDirective],
    exports: [NgxSelectComponent, NgxSelectOptionDirective]
})
export class NgxSelectModule {
}
