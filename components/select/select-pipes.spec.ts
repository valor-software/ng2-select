import {it, expect, describe, inject, beforeEachProviders} from '@angular/core/testing';
import {ComponentFixture} from '@angular/compiler/testing';
import {HighlightPipe} from './select-pipes';

describe('Component: HighlightPipe', () => {
  beforeEachProviders(() => [
    HighlightPipe
  ]);
  it('should be fine', inject([HighlightPipe], (fixture:ComponentFixture<HighlightPipe>) => {
    expect(fixture).not.toBeNull();
  }));
});
