export interface IOptionsBehavior {
  first():any;
  last():any;
  prev():any;
  next():any;
  filter(query:RegExp):any;
}
