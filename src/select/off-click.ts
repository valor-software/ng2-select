import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[offClick]'
})
export class OffClickDirective {
  @Input() public offClick: () => void;

  constructor(private currentElementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  public offClickHandlerInternal($event: any) {
    if (!this.checkIsPathContainsCurrentElement($event)) {
      this.offClick();
    }
  }

  private checkIsPathContainsCurrentElement($event: any) {
    let isPathContainsCurrentElement = false;
    for (let i = 0; i < $event.path.length; i++) {
      const pathElement = $event.path[i];
      if (pathElement === this.currentElementRef.nativeElement) {
        isPathContainsCurrentElement = true;
      }
    }

    return isPathContainsCurrentElement;
  }
}
