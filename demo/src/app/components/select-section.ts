import { Component } from '@angular/core';

let doc = require('html-loader!markdown-loader!../../doc.md');

let tabDesc: any = {
  single: {
    heading: 'Single',
    ts: require('!!raw-loader?lang=typescript!./select/single-demo.ts'),
    html: require('!!raw-loader?lang=markup!./select/single-demo.html')
  }
  ,
  multiple: {
    heading: 'Multiple',
    ts: require('!!raw-loader?lang=typescript!./select/multiple-demo.ts'),
    html: require('!!raw-loader?lang=markup!./select/multiple-demo.html')
  }
  ,
  children: {
    heading: 'Children',
    ts: require('!!raw-loader?lang=typescript!./select/children-demo.ts'),
    html: require('!!raw-loader?lang=markup!./select/children-demo.html')
  }
  ,
  rich: {
    heading: 'Rich',
    ts: require('!!raw-loader?lang=typescript!./select/rich-demo.ts'),
    html: require('!!raw-loader?lang=markup!./select/rich-demo.html')
  }
};

@Component({
  selector: 'select-section',
  template: `
<section>
  <div class="row">
    <tabset>
      <tab heading="Single">
        <sample-section [desc]="tabDesc.single"><single-demo></single-demo></sample-section>
      </tab>
      <tab heading="Multiple">
        <sample-section [desc]="tabDesc.multiple"><multiple-demo></multiple-demo></sample-section>
      </tab>
      <tab heading="Children">
        <sample-section [desc]="tabDesc.children"><children-demo></children-demo></sample-section>
      </tab>
      <tab heading="Rich">
        <sample-section [desc]="tabDesc.rich"><rich-demo></rich-demo></sample-section>
      </tab>
    </tabset>
  </div>

  <div class="row">
    <h2>API</h2>
    <div class="card card-block panel panel-default panel-body" [innerHTML]="doc"></div>
  </div>
</section>
  `
})
export class SelectSectionComponent {
  public currentHeading: string = 'Single';
  public tabDesc: any = tabDesc;
  public doc: string = doc;
}
