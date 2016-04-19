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

describe('Select', () => {

  describe('Initial load with items', () => {
    let rootElement;
    beforeEach(injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb.createAsync(Select)
        .then((componentFixture:ComponentFixture) => {
          componentFixture.detectChanges();
          let selectComponentInstance = componentFixture.componentInstance;
          selectComponentInstance.items = [{id: '1', text: 'first'}, {id: '2', text: 'second'}];
          selectComponentInstance.placeholder = 'TEST';
          componentFixture.detectChanges();
          rootElement = componentFixture.nativeElement;
        });
    }))

    it('should NOT render list items', () => {
      expect(rootElement.querySelectorAll('ul > li > div > a > div').length).toBe(0);
    });

    it('should display placeholder', () => {
      expect(rootElement.querySelector('.ui-select-placeholder')).toBeDefined();
    });
  });

  describe('Initial load without items', () => {
    let rootElement;
    beforeEach(injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb.createAsync(Select)
        .then((componentFixture:ComponentFixture) => {
          componentFixture.detectChanges();
          let selectComponentInstance = componentFixture.componentInstance;
          selectComponentInstance.placeholder = 'TEST';
          componentFixture.detectChanges();
          rootElement = componentFixture.nativeElement;
        });
    }))

    it('should NOT render list items', () => {
      expect(rootElement.querySelectorAll('ul > li > div > a > div').length).toBe(0);
    });

    it('should display placeholder', () => {
      expect(rootElement.querySelector('.ui-select-placeholder')).toBeDefined();
    });
  });


  describe('After clicking with items and enabled', () => {
    let rootElement;
    beforeEach(injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb.createAsync(Select)
        .then((componentFixture:ComponentFixture) => {
          componentFixture.detectChanges();
          let selectComponentInstance = componentFixture.componentInstance;
          selectComponentInstance.items = [{id: '1', text: 'first'}, {id: '2', text: 'second'}];
          selectComponentInstance.placeholder = 'TEST';
          componentFixture.nativeElement.querySelector('.ui-select-placeholder').click();
          componentFixture.detectChanges();
          rootElement = componentFixture.nativeElement;
        });
    }))

    it('should render list items', () => {
      expect(rootElement.querySelectorAll('ul > li > div > a > div')[0].innerHTML).toBe('first');
      expect(rootElement.querySelectorAll('ul > li > div > a > div')[1].innerHTML).toBe('second');
    });

    it('should hide placeholder', () => {
      expect(rootElement.querySelector('.ui-select-placeholder')).toBeNull();
    });
  });

  describe('After clicking with no items', () => {
    let rootElement;
    beforeEach(injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return tcb.createAsync(Select)
        .then((componentFixture:ComponentFixture) => {
          componentFixture.detectChanges();
          let selectComponentInstance = componentFixture.componentInstance;
          selectComponentInstance.placeholder = 'TEST';
          componentFixture.nativeElement.querySelector('.ui-select-placeholder').click();
          componentFixture.detectChanges();
          rootElement = componentFixture.nativeElement;
        });
    }))

    it('should NOT render list items', () => {
      expect(rootElement.querySelectorAll('ul > li > div > a > div').length).toBe(0);
    });

    it('should display placeholder', () => {
      expect(rootElement.querySelector('.ui-select-placeholder')).toBeDefined();
    });
  });



});






