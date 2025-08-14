import { Component, Input } from '@angular/core';
import {MatTabsModule} from "@angular/material/tabs";

@Component({
    selector: 'app-sample-section',
    templateUrl: './sample-section.component.html',
    imports: [
        MatTabsModule
    ]
})
export class SampleSectionComponent {
    @Input() public desc: { heading: string, html: { default: string }, ts: { default: string } };
}
