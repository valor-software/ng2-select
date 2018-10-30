import {Component, ViewEncapsulation} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

const COLORS = [
    {'name': 'Blue 10', 'hex': '#C0E6FF'},
    {'name': 'Blue 20', 'hex': '#7CC7FF'},
    {'name': 'Blue 30', 'hex': '#5AAAFA', disabled: true},
    {'name': 'Blue 40', 'hex': '#5596E6'},
    {'name': 'Blue 50', 'hex': '#4178BE'},
    {'name': 'Blue 60', 'hex': '#325C80'},
    {'name': 'Blue 70', 'hex': '#264A60'},
    {'name': 'Blue 80', 'hex': '#1D3649'},
    {'name': 'Blue 90', 'hex': '#152935'},
    {'name': 'Blue 100', 'hex': '#010205'},
    {'name': 'Green 10', 'hex': '#C8F08F'},
    {'name': 'Green 20', 'hex': '#B4E051'},
    {'name': 'Green 30', 'hex': '#8CD211'},
    {'name': 'Green 40', 'hex': '#5AA700'},
    {'name': 'Green 50', 'hex': '#4B8400'},
    {'name': 'Green 60', 'hex': '#2D660A'},
    {'name': 'Green 70', 'hex': '#144D14'},
    {'name': 'Green 80', 'hex': '#0A3C02'},
    {'name': 'Green 90', 'hex': '#0C2808'},
    {'name': 'Green 100', 'hex': '#010200'},
    {'name': 'Red 10', 'hex': '#FFD2DD'},
    {'name': 'Red 20', 'hex': '#FFA5B4'},
    {'name': 'Red 30', 'hex': '#FF7D87'},
    {'name': 'Red 40', 'hex': '#FF5050'},
    {'name': 'Red 50', 'hex': '#E71D32'},
    {'name': 'Red 60', 'hex': '#AD1625'},
    {'name': 'Red 70', 'hex': '#8C101C'},
    {'name': 'Red 80', 'hex': '#6E0A1E'},
    {'name': 'Red 90', 'hex': '#4C0A17'},
    {'name': 'Red 100', 'hex': '#040001'},
    {'name': 'Yellow 10', 'hex': '#FDE876'},
    {'name': 'Yellow 20', 'hex': '#FDD600'},
    {'name': 'Yellow 30', 'hex': '#EFC100'},
    {'name': 'Yellow 40', 'hex': '#BE9B00'},
    {'name': 'Yellow 50', 'hex': '#8C7300'},
    {'name': 'Yellow 60', 'hex': '#735F00'},
    {'name': 'Yellow 70', 'hex': '#574A00'},
    {'name': 'Yellow 80', 'hex': '#3C3200'},
    {'name': 'Yellow 90', 'hex': '#281E00'},
    {'name': 'Yellow 100', 'hex': '#020100'}
];

@Component({
    selector: 'rich-demo',
    templateUrl: './rich-demo.html',
    styles: [`.color-box {
        display: inline-block;
        height: 14px;
        width: 14px;
        margin-right: 4px;
        border: 1px solid #000;
    }`],
    encapsulation: ViewEncapsulation.None  // Enable dynamic HTML styles
})
export class RichDemoComponent {
    public items: any[] = COLORS;

    public ngxValue: any = [];
    public ngxDisabled = false;

    constructor(public sanitizer: DomSanitizer) {
    }

    style(data: string): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(data);
    }
}
