import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HighlightPipe } from './common/select-pipes';
import { OffClickDirective } from './common/off-click';
import { SelectComponent } from './select/select.component';
import { NgxSelectComponent } from './ngx-select/ngx-select.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    SelectComponent, NgxSelectComponent, HighlightPipe, OffClickDirective
  ],
  exports: [
    SelectComponent, NgxSelectComponent, HighlightPipe, OffClickDirective
  ]
})
export class SelectModule {
}
