import { Directive, ElementRef, Input, HostListener, Output, EventEmitter } from '@angular/core';

export interface IExtMouseEvent extends MouseEvent {
  path: HTMLElement[];
}

/**
 * @deprecated
 */
@Directive({
  selector: '[offClick]'
})
export class OffClickDirective {
  @Output() public clickedOutside: EventEmitter<void> = new EventEmitter<void>();

  constructor(private currentElementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  public offClickHandlerInternal($event: IExtMouseEvent) {
    if (!this.checkIsPathContainsCurrentElement($event)) {
      this.clickedOutside.emit();
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
