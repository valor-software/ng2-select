import {Component, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {INgxSelectOption} from '../../lib/ngx-select/ngx-select.interfaces';

@Component({
    selector: 'single-demo',
    templateUrl: './single-demo.html'
})
export class SingleDemoComponent implements OnDestroy {
    public items: string[] = ['Amsterdam', 'Antwerp', 'Athens', 'Barcelona',
        'Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest',
        'Budapest', 'Cologne', 'Copenhagen', 'Dortmund', 'Dresden', 'Dublin',
        'Düsseldorf', 'Essen', 'Frankfurt', 'Genoa', 'Glasgow', 'Gothenburg',
        'Hamburg', 'Hannover', 'Helsinki', 'Kraków', 'Leeds', 'Leipzig', 'Lisbon',
        'London', 'Madrid', 'Manchester', 'Marseille', 'Milan', 'Munich', 'Málaga',
        'Naples', 'Palermo', 'Paris', 'Poznań', 'Prague', 'Riga', 'Rome',
        'Rotterdam', 'Seville', 'Sheffield', 'Sofia', 'Stockholm', 'Stuttgart',
        'The Hague', 'Turin', 'Valencia', 'Vienna', 'Vilnius', 'Warsaw', 'Wrocław',
        'Zagreb', 'Zaragoza', 'Łódź'];

    public ngxControl = new FormControl();

    private _ngxDefaultTimeout;
    private _ngxDefaultInterval;
    private _ngxDefault;

    constructor() {
        this._ngxDefaultTimeout = setTimeout(() => {
            this._ngxDefaultInterval = setInterval(() => {
                const idx = Math.floor(Math.random() * (this.items.length - 1));
                this._ngxDefault = this.items[idx];
                // console.log('new default value = ', this._ngxDefault);
            }, 2000);
        }, 2000);
    }

    ngOnDestroy(): void {
        clearTimeout(this._ngxDefaultTimeout);
        clearInterval(this._ngxDefaultInterval);
    }

    public doNgxDefault(): any {
        return this._ngxDefault;
    }

    public inputTyped = (source: string, text: string) => console.log('SingleDemoComponent.inputTyped', source, text);

    public doFocus = () => console.log('SingleDemoComponent.doFocus');

    public doBlur = () => console.log('SingleDemoComponent.doBlur');

    public doOpen = () => console.log('SingleDemoComponent.doOpen');

    public doClose = () => console.log('SingleDemoComponent.doClose');

    public doSelect = (value: any) => console.log('SingleDemoComponent.doSelect', value);

    public doRemove = (value: any) => console.log('SingleDemoComponent.doRemove', value);

    public doSelectOptions = (options: INgxSelectOption[]) => console.log('SingleDemoComponent.doSelectOptions', options);
}
