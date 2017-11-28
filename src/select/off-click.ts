import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[offClick]',
  host: {
    '(document:click)': 'offClickHandlerInternal($event)',
  },
})

export class OffClickDirective {
  @Input('offClick') public offClickHandler: any;

  constructor(private currentElementRef: ElementRef) {
  }

  public offClickHandlerInternal($event: any) {
    let isPathContainsCurrentElement = this.checkIsPathContainsCurrentElement($event);
    if (!isPathContainsCurrentElement) {
      this.offClickHandler();
    }
  }

  private checkIsPathContainsCurrentElement($event: any) {
    let isPathContainsCurrentElement = false;
    $event.path.forEach((pathElement: any) => {
      if (pathElement == this.currentElementRef.nativeElement) {
        console.log("PATH CONTAINS", pathElement, this.currentElementRef.nativeElement);
        isPathContainsCurrentElement = true;
      }
    });
    return isPathContainsCurrentElement;
  }
}
