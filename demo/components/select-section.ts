import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

import {TAB_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {SingleDemo} from './select/single-demo';
import {MultipleDemo} from './select/multiple-demo';
import {ChildrenDemo} from './select/children-demo';
import {RichDemo} from './select/rich-demo';

let name = 'Select';
// webpack html imports
let doc = require('../../components/select/readme.md');

let tabDesc:Array<any> = [
  {
    heading: 'Single',
    ts: require('!!prismjs?lang=typescript!./select/single-demo.ts'),
    html: require('!!prismjs?lang=markup!./select/single-demo.html')
  },
  {
    heading: 'Multiple',
    ts: require('!!prismjs?lang=typescript!./select/multiple-demo.ts'),
    html: require('!!prismjs?lang=markup!./select/multiple-demo.html')
  },
  {
    heading: 'Children',
    ts: require('!!prismjs?lang=typescript!./select/children-demo.ts'),
    html: require('!!prismjs?lang=markup!./select/children-demo.html')
  },
  {
    heading: 'Rich',
    ts: require('!!prismjs?lang=typescript!./select/rich-demo.ts'),
    html: require('!!prismjs?lang=markup!./select/rich-demo.html')
  }
];

let tabsContent:string = ``;
tabDesc.forEach(desc => {
  tabsContent += `
  <div *ngIf="currentHeading === '${desc.heading}'">
    <${desc.heading.toLowerCase()}-demo>
    </${desc.heading.toLowerCase()}-demo>
  </div>
<pre>{{ currentHeading }}</pre>
<tab heading="${desc.heading}" (select)="select_zzz($event)">
  <div class="card card-block panel panel-default panel-body">
    <br>

    <div class="row" style="margin: 0px;">
      <tabset>
        <tab heading="Markup">
          <div class="card card-block panel panel-default panel-body">
            <pre class="language-html"><code class="language-html" ngNonBindable>${desc.html}</code></pre>
          </div>
        </tab>
        <tab heading="TypeScript">
          <div class="card card-block panel panel-default panel-body">
            <pre class="language-typescript">
              <code class="language-typescript" ngNonBindable>${desc.ts}</code>
            </pre>
          </div>
        </tab>
      </tabset>
    </div>
  </div>
</tab>
  `;
});

@Component({
  selector: 'select-section',
  template: `
  <section id="${name.toLowerCase()}">
    <div class="row">
      <tabset>

        ${tabsContent}

      </tabset>
    </div>

    <div class="row">
      <h2>API</h2>
      <div class="card card-block panel panel-default panel-body">${doc}</div>
    </div>
  </section>
  `,
  directives: [SingleDemo, MultipleDemo, ChildrenDemo, RichDemo, TAB_DIRECTIVES, CORE_DIRECTIVES]
})
export class SelectSection {
  public currentHeading:string = 'Single';

  public select_zzz(e:any) {
    if (e.heading) {
      this.currentHeading = e.heading;
    }
  }
}
