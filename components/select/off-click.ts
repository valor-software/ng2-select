import {Directive, Host, HostListener, Input} from 'angular2/core';

@Directive({
  selector: '[offClick]'
})

export class OffClickDirective {
  /* tslint:disable */
  @Input('offClick') offClickHandler: any;
  /* tslint:enable */
  @HostListener('click', ['$event']) onClick($event) {
    $event.stopPropagation();
  }

  constructor() {
  }

  ngOnInit() {
    setTimeout(() => {document.addEventListener('click', this.offClickHandler);}, 0);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.offClickHandler);
  }

}
