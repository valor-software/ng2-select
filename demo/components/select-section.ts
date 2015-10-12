/// <reference path="../../tsd.d.ts" />

import {Component, View, CORE_DIRECTIVES} from 'angular2/angular2';

import {tabs} from 'ng2-bootstrap';
import {SingleDemo} from './select/single-demo';
/*import {MultipleDemo} from './select/multiple-demo';
import {ChildrenDemo} from './select/children-demo';*/

let name = 'Select';
let src = 'https://github.com/valor-software/ng2-select/blob/master/components/select/select.ts';
// webpack html imports
let doc = require('../../components/select/readme.md');

let tabDesc:Array<any> = [
  {
    heading: 'Single',
    ts: require('!!prismjs?lang=typescript!./select/single-demo.ts'),
    html: require('!!prismjs?lang=markup!./select/single-demo.html')
  }/*,
  {
    heading: 'Multiple',
    ts: require('!!prismjs?lang=typescript!./select/multiple-demo.ts'),
    html: require('!!prismjs?lang=markup!./select/multiple-demo.html')
  },
  {
    heading: 'Children',
    ts: require('!!prismjs?lang=typescript!./select/children-demo.ts'),
    html: require('!!prismjs?lang=markup!./select/children-demo.html')
  }*/
];

let tabsContent:string = ``;
tabDesc.forEach(desc => {
  tabsContent += `
          <tab heading="${desc.heading}" (select)="select($event)">
          <div class="card card-block panel panel-default panel-body">

            <${desc.heading.toLowerCase()}-demo *ng-if="currentHeading === '${desc.heading}'"></${desc.heading.toLowerCase()}-demo>

            <br>

            <div class="row" style="margin: 0px;">
              <tabset>
                <tab heading="Markup">
                  <div class="card card-block panel panel-default panel-body">
                    <pre class="language-html"><code class="language-html" ng-non-bindable>${desc.html}</code></pre>
                  </div>
                </tab>
                <tab heading="TypeScript">
                  <div class="card card-block panel panel-default panel-body">
                    <pre class="language-typescript"><code class="language-typescript" ng-non-bindable>${desc.ts}</code></pre>
                  </div>
                </tab>
              </tabset>
            </div>
          </div>
        </tab>
  `;
});

@Component({
  selector: 'select-section'
})
@View({
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
  // directives: [SingleDemo, MultipleDemo, ChildrenDemo, tabs, CORE_DIRECTIVES]
  directives: [SingleDemo, tabs, CORE_DIRECTIVES]
})
export class SelectSection {
  private currentHeading:string = 'Single';

  private select(e) {
    if (e.heading) {
      this.currentHeading = e.heading;
    }
  }
}
