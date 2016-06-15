export interface OptionsBehavior {
  first():any;
  last():any;
  prev():any;
  next():any;
  updateHighlighted():any;
  filter(query:RegExp):any;
}
