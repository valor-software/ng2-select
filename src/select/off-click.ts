import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[offClick]'
})
export class OffClickDirective {
  @Input() public offClick: () => void;

  constructor(private currentElementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  public offClickHandlerInternal($event: MouseEvent) {
    if (!this.checkIsPathContainsCurrentElement($event)) {
      this.offClick();
    }
  }

  private checkIsPathContainsCurrentElement($event: MouseEvent) {
    let el: HTMLElement = <HTMLElement>$event.target;
    while (el) {
      if (el === this.currentElementRef.nativeElement) {
        return true;
      }
      el = el.parentElement;
    }
    return false;
  }
}
