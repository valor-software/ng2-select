export function escapeRegexp(queryToEscape:string):string {
  return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
}
