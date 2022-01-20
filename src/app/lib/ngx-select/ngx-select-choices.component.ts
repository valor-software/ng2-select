import { AfterContentInit, Component, ElementRef, HostBinding, Input, NgZone, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { INgxSelectOption } from './ngx-select.interfaces';

export interface NgxElementPosition {
    top: number;
    left: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
}

@Component({
    selector: 'ngx-select-choices',
    template: '<ng-content></ng-content>',
})
export class NgxSelectChoicesComponent implements OnInit, OnDestroy, OnChanges, AfterContentInit {
    @Input() public appendTo: string;
    @Input() public show: boolean;
    @Input() public selectionChanges: Observable<INgxSelectOption[]>;

    private choiceMenuEl: HTMLElement;
    private selectEl: HTMLElement;
    private destroy$ = new Subject<void>();
    private disposeResizeListener: () => void;

    @HostBinding('style.position')
    public get position(): string {
        return this.appendTo ? 'absolute' : '';
    }

    constructor(private renderer: Renderer2, private ngZone: NgZone, elementRef: ElementRef) {
        this.choiceMenuEl = elementRef.nativeElement;
    }

    public ngOnInit(): void {
        this.selectionChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.delayedPositionUpdate());
        this.selectEl = this.choiceMenuEl.parentElement;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.show?.currentValue) {
            this.delayedPositionUpdate();
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();

        if (this.appendTo) {
            this.renderer.removeChild(this.choiceMenuEl.parentNode, this.choiceMenuEl);

            if (this.disposeResizeListener) {
                this.disposeResizeListener();
            }
        }
    }

    public ngAfterContentInit(): void {
        if (this.appendTo) {
            this.appendChoiceMenu();
            this.handleDocumentResize();
            this.delayedPositionUpdate();
        }
    }

    private appendChoiceMenu(): void {
        const target = this.getAppendToElement();
        if (!target) {
            throw new Error(`appendTo selector ${this.appendTo} did not found any element`);
        }
        this.renderer.appendChild(target, this.choiceMenuEl);
    }

    private getAppendToElement() {
        return document.querySelector(this.appendTo) as HTMLElement;
    }

    private handleDocumentResize() {
        this.disposeResizeListener = this.renderer.listen('window', 'resize', () => {
            this.updatePosition();
        });
    }

    private delayedPositionUpdate(): void {
        if (this.appendTo) {
            this.ngZone.runOutsideAngular(() => {
                window.requestAnimationFrame(() => {
                    this.updatePosition();
                });
            });
        }
    }

    private updatePosition() {
        if (this.show) {
            const selectOffset = this.getViewportOffset(this.selectEl);
            const relativeParentOffset = this.getParentOffset(this.choiceMenuEl);

            const offsetTop = selectOffset.top - relativeParentOffset.top;
            const offsetLeft = selectOffset.left - relativeParentOffset.left;

            this.choiceMenuEl.style.top = `${offsetTop + selectOffset.height}px`;
            this.choiceMenuEl.style.bottom = 'auto';
            this.choiceMenuEl.style.left = `${offsetLeft}px`;
            this.choiceMenuEl.style.width = `${selectOffset.width}px`;
            this.choiceMenuEl.style.minWidth = `${selectOffset.width}px`;
        }
    }

    private getStyles(element: HTMLElement): CSSStyleDeclaration {
        return window.getComputedStyle(element);
    }

    private getStyleProp(element: HTMLElement, prop: keyof CSSStyleDeclaration) {
        return this.getStyles(element)[prop];
    }

    private isStatic(element: HTMLElement): boolean {
        return (this.getStyleProp(element, 'position') || 'static') === 'static';
    }

    private getOffsetParent(element: HTMLElement): HTMLElement {
        let offsetParentEl = element.offsetParent as HTMLElement;

        while (offsetParentEl && offsetParentEl !== document.documentElement && this.isStatic(offsetParentEl)) {
            offsetParentEl = offsetParentEl.offsetParent as HTMLElement;
        }

        return offsetParentEl || document.documentElement;
    }

    private getViewportOffset(element: HTMLElement): NgxElementPosition {
        const rect = element.getBoundingClientRect();
        const offsetTop = window.scrollY - document.documentElement.clientTop;
        const offsetLeft = window.scrollX - document.documentElement.clientLeft;

        const elOffset = {
            height: rect.height || element.offsetHeight,
            width: rect.width || element.offsetWidth,
            top: rect.top + offsetTop,
            bottom: rect.bottom + offsetTop,
            left: rect.left + offsetLeft,
            right: rect.right + offsetLeft,
        };

        return elOffset;
    }

    private getParentOffset(element: HTMLElement): NgxElementPosition {
        let parentOffset: NgxElementPosition = { width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 };
        if (this.getStyleProp(element, 'position') === 'fixed') {
            return parentOffset;
        }

        const offsetParentEl = this.getOffsetParent(element);
        if (offsetParentEl !== document.documentElement) {
            parentOffset = this.getViewportOffset(offsetParentEl);
        }

        parentOffset.top += offsetParentEl.clientTop;
        parentOffset.left += offsetParentEl.clientLeft;

        return parentOffset;
    }
}
