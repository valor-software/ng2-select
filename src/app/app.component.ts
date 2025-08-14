import { Component, AfterContentInit } from '@angular/core';
import { NgxSelectModule } from 'ngx-select-ex';
import {SelectSectionComponent} from './demo/select-section';

declare const require: any;

const pac = require('../../package.json');

const gettingStarted = require('html-loader!markdown-loader!./getting-started.md')?.default;

@Component({
    selector: 'app-root',
    imports: [NgxSelectModule, SelectSectionComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})

export class AppComponent implements AfterContentInit {
    public gettingStarted: string = gettingStarted;
    public p = pac;

    public ngAfterContentInit(): any {
        setTimeout(() => {
            // if (typeof PR !== 'undefined') {
            //     google code-prettify
                // PR.prettyPrint();
            // }
        }, 150);
    }
}
