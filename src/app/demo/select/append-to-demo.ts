import { Component } from '@angular/core';
import {ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {NgxSelectModule} from "ngx-select-ex";
import {JsonPipe} from "@angular/common";

@Component({
    selector: 'app-append-to-demo',
    templateUrl: './append-to-demo.html',
    imports: [
        NgxSelectModule,
        ReactiveFormsModule,
        JsonPipe
    ]
})
export class AppendToDemoComponent {
    public items: string[] = ['Amsterdam', 'Antwerp', 'Athens', 'Barcelona',
        'Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest',
        'Budapest', 'Cologne', 'Copenhagen'];

    public ngxControl1 = new UntypedFormControl();
    public ngxControl2 = new UntypedFormControl();
}
