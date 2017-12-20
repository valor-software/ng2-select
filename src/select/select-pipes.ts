import { Pipe, PipeTransform } from '@angular/core';
import { escapeRegexp } from './common';

@Pipe({name: 'highlight'})
export class HighlightPipe implements PipeTransform {
  public transform(value: string, query: string): any {
    if (query.length < 1) {
      return value;
    }

    if (query) {
      const tagRE = new RegExp('<[^<>]*>', 'ig');
      // get ist of tags
      const tagList = value.match(tagRE);
      // Replace tags with token
      const tmpValue = value.replace(tagRE, '$!$');
      // Replace search words
      value = tmpValue.replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>');
      // Reinsert HTML
      for (let i = 0; value.indexOf('$!$') > -1; i++) {
        value = value.replace('$!$', tagList[i]);
      }
    }
    return value;
  }
}
