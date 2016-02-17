import {Pipe} from 'angular2/core';

@Pipe({
  name: 'hightlight'
})
export class HightlightPipe {
  transform(value:string, args:any[]) {
    if (args.length < 1) {
      return value;
    }

    let query = args[0];

    if ( query ) {
        let tagRE    = new RegExp("<[^<>]*>", "ig");
        // get ist of tags
        let tagList  = value.match( tagRE );
        //Replace tags with token
        let tmpValue = value.replace( tagRE, "$!$");
        //Replace search words
        value = tmpValue.replace(new RegExp(this.escapeRegexp(query), 'gi'),'<strong>$&</strong>');
        //Reinsert HTML
        for(let i=0;value.indexOf("$!$") > -1;i++){
          value = value.replace("$!$", tagList[i]);
        }
    }
    return value;
    // return query ?
    //   value.replace(new RegExp(this.escapeRegexp(query), 'gi'), ) :
    //   value;
  }

  private escapeRegexp(queryToEscape:string) {
    return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  }
}

export function stripTags(input:string) {
  let tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
      commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '').replace(tags, '');
}