import { Directive, HostListener, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[offClick]'
})

export class OffClickDirective implements OnInit, OnDestroy {
  /* tslint:disable */
  @Input('offClick') public offClickHandler: any;
  /* tslint:enable */
  @HostListener('click', ['$event']) public onClick($event: MouseEvent): void {
    $event.stopPropagation();
  }

  public ngOnInit(): any {
    setTimeout(() => {
      if (typeof document !== 'undefined') {
        document.addEventListener('click', () => {
          this.offClickHandler(-1);
        });

        let spans = document.getElementsByClassName('ui-select-toggle');
        for (let i = 0; i < spans.length; i++) {
          spans[i].removeEventListener('click', this.offClickHandler);

          let id = parseInt(spans[i].id);
          spans[i].addEventListener('click', () => {
            this.offClickHandler(id);
          });
        }
      }
    }, 0);
  }

  public ngOnDestroy(): any {
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this.offClickHandler);

      let spans = document.getElementsByClassName('ui-select-toggle');
      for (let i = 0; i < spans.length; i++) {
        spans[i].removeEventListener('click', this.offClickHandler);
      }
    }
  }
}
