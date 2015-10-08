import {Pipe} from 'angular2/angular2';

@Pipe({
  name: 'hightlight'
})
export class HightlightPipe {
  transform(value:string, args:any[]) {
    if (args.length < 1) {
      return value;
    }

    let query = args[0];

    return query ?
      value.replace(new RegExp(this.escapeRegexp(query), 'gi'), '<strong>$&</strong>') :
      value;
  }

  private escapeRegexp(queryToEscape) {
    return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  }
}
