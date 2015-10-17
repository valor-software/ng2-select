/// <reference path="../tsd.d.ts" />
import {Component, View, bootstrap, NgClass} from 'angular2/angular2';

import {Ng2SelectConfig, Ng2SelectTheme} from '../components/index';

let w:any = window;
if (w && w.__theme === 'bs4') {
  Ng2SelectConfig.theme = Ng2SelectTheme.BS4;
}


import {SelectSection} from './components/select-section';

let gettingStarted = require('./getting-started.md');

@Component({
  selector: 'app'
})
@View({
  template: `
  <!--<demo-header>Loading header</demo-header>-->

  <main class="bd-pageheader">
    <div class="container">
      <h1>ng2-select</h1>
      <p>Native Angular2 component for Select</p>
      <a class="btn btn-primary" href="https://github.com/valor-software/ng2-select">View on GitHub</a>
      <div class="row">
        <div class="col-lg-1"><iframe src="https://ghbtns.com/github-btn.html?user=valor-software&repo=ng2-select&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe></div>
        <div class="col-lg-1"><iframe src="https://ghbtns.com/github-btn.html?user=valor-software&repo=ng2-select&type=fork&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe></div>
      </div>
    </div>
  </main>

  <div class="container">
    <div class="col-md-12 card card-block panel panel-default">
      <selection>
          <h1>ng2-select available with:
          <a class="btn btn-default btn-secondary btn-lg" [ng-class]="{active: isBs3}" href="./">Bootstrap 3</a>
          <a class="btn btn-default btn-secondary btn-lg" [ng-class]="{active: !isBs3}" href="./index-bs4.html">Bootstrap 4</a>
          </h1>
      </selection>
    </div>
    <br>
    <section id="getting-started">${gettingStarted}</section>

    <select-section class="col-md-12"></select-section>
  </div>

  </div>
  <footer class="footer">
    <div class="container">
      <p class="text-muted text-center"><a href="https://github.com/valor-software/ng2-select">ng2-select</a> is maintained by <a href="https://github.com/valor-software">valor-software</a>.</p>
    </div>
  </footer>
  `,
  directives: [
    NgClass,
    SelectSection
  ]
})
export class Demo {
  private isBs3:boolean = Ng2SelectConfig.theme === Ng2SelectTheme.BS3;
}

bootstrap(Demo);
