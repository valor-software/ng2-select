import { Component, Input } from '@angular/core';

@Component({
    selector: 'sample-section',
    templateUrl: './sample-section.component.html',
})
export class SampleSectionComponent {
    @Input() public desc: { heading: string, html: { default: string }, ts: { default: string } };
}
