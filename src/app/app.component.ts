import {Component, AfterContentInit} from '@angular/core';

const pac = require('../app/lib/package.json');

const gettingStarted = require('html-loader!markdown-loader!./getting-started.md');

@Component({
    selector: 'app-demo',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
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
