import { Component, AfterContentInit } from '@angular/core';

declare const require: any;

// tslint:disable-next-line:no-var-requires
const pac = require('../../package.json');

// tslint:disable-next-line:no-var-requires
const gettingStarted = require('html-loader!markdown-loader!./getting-started.md');

@Component({
    selector: 'app-demo',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})

export class AppComponent implements AfterContentInit {
    public gettingStarted: string = gettingStarted;
    public p = pac;

    public ngAfterContentInit(): any {
        setTimeout(() => {
            if (typeof PR !== 'undefined') {
                // google code-prettify
                PR.prettyPrint();
            }
        }, 150);
    }
}
