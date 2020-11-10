import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxSelectModule } from './lib/public_api';
import { SampleSectionComponent } from './demo/sample-section.component';
import { SelectSectionComponent } from './demo/select-section';
import { ChildrenDemoComponent } from './demo/select/children-demo';
import { MultipleDemoComponent } from './demo/select/multiple-demo';
import { NoAutoCompleteDemoComponent } from './demo/select/no-autocomplete-demo';
import { RichDemoComponent } from './demo/select/rich-demo';
import { SingleDemoComponent } from './demo/select/single-demo';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';


@NgModule({
    declarations: [
        AppComponent,
        SampleSectionComponent,
        SelectSectionComponent,
        ChildrenDemoComponent,
        MultipleDemoComponent,
        NoAutoCompleteDemoComponent,
        RichDemoComponent,
        SingleDemoComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSelectModule,
        TabsModule.forRoot(),
        ButtonsModule.forRoot(),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
