import {Pipe} from 'angular2/core';
import {escapeRegexp} from './common';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe {
  transform(value:string, args:any[]) {
    if (args.length < 1) {
      return value;
    }

    let query = args[0];

    if ( query ) {
        let tagRE    = new RegExp('<[^<>]*>', 'ig');
        // get ist of tags
        let tagList  = value.match( tagRE );
        // Replace tags with token
        let tmpValue = value.replace( tagRE, '$!$');
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

export function stripTags(input:string) {
  let tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
      commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '').replace(tags, '');
}
