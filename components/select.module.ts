import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectComponent } from './select/select';
import { HighlightPipe } from './select/select-pipes';
import { OffClickDirective } from './select/off-click';

@NgModule({
  imports: [CommonModule],
  declarations: [SelectComponent, HighlightPipe, OffClickDirective],
  exports: [SelectComponent, HighlightPipe, OffClickDirective]
})
export class SelectModule {
}
