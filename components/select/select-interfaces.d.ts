export interface OptionsBehavior {
    first(): any;
    last(): any;
    prev(): any;
    next(): any;
    filter(query: RegExp): any;
}
