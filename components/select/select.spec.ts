import {it, expect} from 'angular2/testing';

describe('TEST', () => {
  it('true is true', () => {
    expect(true).toBe(true);
  });
  describe('Load TestComponentBuilder', () => {
    // beforeEach(injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    //   return tcb.createAsync(Select)
    //     .then((componentFixture:ComponentFixture) => {
    //     });
    // }));
    it('true is true', () => {
      expect(true).toBe(true);
    });
  });
});
