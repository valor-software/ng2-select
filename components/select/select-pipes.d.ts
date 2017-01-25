import { PipeTransform } from '@angular/core';
export declare class HighlightPipe implements PipeTransform {
    transform(value: string, query: string): any;
}
export declare function stripTags(input: string): string;
