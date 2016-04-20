import {
  it,
  inject,
  injectAsync,
  beforeEachProviders,
  beforeEach,
  TestComponentBuilder,
  ComponentFixture,
  expect

} from 'angular2/testing';

import {Component, provide} from 'angular2/core';

import {Select} from './select';

describe('TEST', () => {

    it('true is true', () => {
      expect(true).toBe(true);
    });

  describe('Load TestComponentBuilder', () => {
    let rootElement : any;
    beforeEach(injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb.createAsync(Select)
        .then((componentFixture:ComponentFixture) => {

        });
    }))

    it('true is true', () => {
      expect(true).toBe(true);
    });

  });

});
