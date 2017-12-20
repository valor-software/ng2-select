import { Directive, ElementRef, Input, HostListener } from '@angular/core';

export interface IExtMouseEvent extends MouseEvent {
  path: HTMLElement[];
}

@Directive({
  selector: '[offClick]'
})
export class OffClickDirective {
  @Input() public offClick: () => void;

  constructor(private currentElementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  public offClickHandlerInternal($event: IExtMouseEvent) {
    if (!this.checkIsPathContainsCurrentElement($event)) {
      this.offClick();
    }
  }

  private checkIsPathContainsCurrentElement($event: IExtMouseEvent) {
    for (const pathElement of $event.path) {
      if (pathElement === this.currentElementRef.nativeElement) {
        return true;
      }
    }
    return false;
  }
}
