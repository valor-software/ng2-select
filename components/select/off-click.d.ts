import { OnInit, OnDestroy } from '@angular/core';
export declare class OffClickDirective implements OnInit, OnDestroy {
    offClickHandler: any;
    onClick($event: MouseEvent): void;
    ngOnInit(): any;
    ngOnDestroy(): any;
}
