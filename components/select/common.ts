export function escapeRegexp(queryToEscape:string) {
  return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
}
