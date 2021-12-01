import { Component } from '@angular/core';

declare const require: any;

// tslint:disable-next-line:no-var-requires
const doc = require('html-loader!markdown-loader!../doc.md');

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
    selector: 'select-section',
    styles: [`:host {
        display: block
    }`],
    template: `
        <section>
            <tabset>
                <tab heading="Single">
                    <sample-section [desc]="tabDesc.single">
                        <single-demo></single-demo>
                    </sample-section>
                </tab>
                <tab heading="Multiple">
                    <sample-section [desc]="tabDesc.multiple">
                        <multiple-demo></multiple-demo>
                    </sample-section>
                </tab>
                <tab heading="Children">
                    <sample-section [desc]="tabDesc.children">
                        <children-demo></children-demo>
                    </sample-section>
                </tab>
                <tab heading="Rich">
                    <sample-section [desc]="tabDesc.rich">
                        <rich-demo></rich-demo>
                    </sample-section>
                </tab>
                <tab heading="No autocomplete">
                    <sample-section [desc]="tabDesc.noAutoComplete">
                        <no-autocomplete-demo></no-autocomplete-demo>
                    </sample-section>
                </tab>
                <tab heading="Append to element">
                    <sample-section [desc]="tabDesc.appendTo">
                        <append-to-demo></append-to-demo>
                    </sample-section>
                </tab>
            </tabset>

            <h2>Documentation</h2>
            <div class="card card-block panel panel-default panel-body">
                <div class="card-body doc-api" [innerHTML]="doc"></div>
            </div>
        </section>
    `,
})
export class SelectSectionComponent {
    public currentHeading = 'Single';
    public tabDesc = tabDesc;
    public doc: string = doc;
}
