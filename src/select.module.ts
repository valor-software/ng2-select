import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxSelectComponent } from './ngx-select/ngx-select.component';

@NgModule({
  imports: [CommonModule],
  declarations: [NgxSelectComponent],
  exports: [NgxSelectComponent]
})
export class SelectModule {
}
