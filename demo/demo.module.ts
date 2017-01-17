import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TabsModule, ButtonsModule } from 'ng2-bootstrap/ng2-bootstrap';

import { SelectModule } from '../components/select.module';
import { DemoComponent } from './demo.component';
import { SelectSectionComponent } from './components/select-section';
import { ChildrenDemoComponent } from './components/select/children-demo';
import { MultipleDemoComponent } from './components/select/multiple-demo';
import { RichDemoComponent } from './components/select/rich-demo';
import { SingleDemoComponent } from './components/select/single-demo';

@NgModule({
  declarations: [
    DemoComponent,
    SelectSectionComponent,
    ChildrenDemoComponent,
    MultipleDemoComponent,
    RichDemoComponent,
    SingleDemoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SelectModule,
    TabsModule,
    ButtonsModule,
    CommonModule
  ],
  bootstrap: [DemoComponent]
})

export class SelectDemoModule {
}
