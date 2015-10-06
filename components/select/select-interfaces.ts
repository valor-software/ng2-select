export interface IOptionsBehavior {
  first();
  last();
  prev();
  next();
  filter(query:RegExp);
}
