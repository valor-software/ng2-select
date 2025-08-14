import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {SampleSectionComponent} from './sample-section.component';
import {SingleDemoComponent} from './select/single-demo';
import {MultipleDemoComponent} from './select/multiple-demo';
import {ChildrenDemoComponent} from './select/children-demo';
import {RichDemoComponent} from './select/rich-demo';
import {NoAutoCompleteDemoComponent} from './select/no-autocomplete-demo';
import {AppendToDemoComponent} from './select/append-to-demo';

declare const require: any;

const doc = require('html-loader!markdown-loader!../doc.md')?.default;

const tabDesc = {
    single: {
        heading: 'Single',
        ts: require('!!raw-loader!./select/single-demo.ts'),
        html: require('!!raw-loader!./select/single-demo.html'),
    },
    multiple: {
        heading: 'Multiple',
        ts: require('!!raw-loader!./select/multiple-demo.ts'),
        html: require('!!raw-loader!./select/multiple-demo.html'),
    },
    children: {
        heading: 'Children',
        ts: require('!!raw-loader!./select/children-demo.ts'),
        html: require('!!raw-loader!./select/children-demo.html'),
    },
    rich: {
        heading: 'Rich',
        ts: require('!!raw-loader!./select/rich-demo.ts'),
        html: require('!!raw-loader!./select/rich-demo.html'),
    },
    noAutoComplete: {
        heading: 'noAutoComplete',
        ts: require('!!raw-loader!./select/no-autocomplete-demo.ts'),
        html: require('!!raw-loader!./select/no-autocomplete-demo.html'),
    },
    appendTo: {
        heading: 'appendTo',
        ts: require('!!raw-loader!./select/append-to-demo.ts'),
        html: require('!!raw-loader!./select/append-to-demo.html'),
    },
};

@Component({
  selector: 'app-select-section',
  styles: [`:host {
    display: block
  }`],
  template: `
    <section>
      <mat-tab-group>
        <mat-tab label="Single">
          <app-sample-section [desc]="tabDesc.single">
            <app-single-demo></app-single-demo>
          </app-sample-section>
        </mat-tab>
        <mat-tab label="Multiple">
          <app-sample-section [desc]="tabDesc.multiple">
            <app-multiple-demo></app-multiple-demo>
          </app-sample-section>
        </mat-tab>
        <mat-tab label="Children">
          <app-sample-section [desc]="tabDesc.children">
            <app-children-demo></app-children-demo>
          </app-sample-section>
        </mat-tab>
        <mat-tab label="Rich">
          <app-sample-section [desc]="tabDesc.rich">
            <app-rich-demo></app-rich-demo>
          </app-sample-section>
        </mat-tab>
        <mat-tab label="No autocomplete">
          <app-sample-section [desc]="tabDesc.noAutoComplete">
            <app-no-autocomplete-demo></app-no-autocomplete-demo>
          </app-sample-section>
        </mat-tab>
        <mat-tab label="Append to element">
          <app-sample-section [desc]="tabDesc.appendTo">
            <app-append-to-demo></app-append-to-demo>
          </app-sample-section>
        </mat-tab>
      </mat-tab-group>

      <h2>Documentation</h2>
      <div class="card card-block panel panel-default panel-body">
        <div class="card-body doc-api" [innerHTML]="doc"></div>
      </div>
    </section>
  `,
  imports: [
    MatTabsModule,
    SampleSectionComponent,
    SingleDemoComponent,
    MultipleDemoComponent,
    ChildrenDemoComponent,
    RichDemoComponent,
    NoAutoCompleteDemoComponent,
    AppendToDemoComponent
  ]
})
export class SelectSectionComponent {
    public currentHeading = 'Single';
    public tabDesc = tabDesc;
    public doc: string = doc;
}
