export interface OptionsBehavior {
  first():any;
  last():any;
  prev():any;
  next():any;
  current():any;
  filter(query:RegExp):any;
}
