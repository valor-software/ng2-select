import {NgxSelectModule} from 'ngx-select-ex';
import { TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SelectSectionComponent } from './demo/select-section';
import { SampleSectionComponent } from './demo/sample-section.component';
import { SingleDemoComponent } from './demo/select/single-demo';
import { RichDemoComponent } from './demo/select/rich-demo';
import { MultipleDemoComponent } from './demo/select/multiple-demo';
import { ChildrenDemoComponent } from './demo/select/children-demo';
import { NoAutoCompleteDemoComponent } from './demo/select/no-autocomplete-demo';
import { AppendToDemoComponent } from './demo/select/append-to-demo';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('AppComponent', () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                FormsModule,
                ReactiveFormsModule,
                NoopAnimationsModule,
                NgxSelectModule,
                CommonModule,
                AppComponent,
                SampleSectionComponent,
                SelectSectionComponent,
                ChildrenDemoComponent,
                MultipleDemoComponent,
                NoAutoCompleteDemoComponent,
                RichDemoComponent,
                SingleDemoComponent,
                AppendToDemoComponent,
            ],
        }).compileComponents();
    }));
    it('should create the app', fakeAsync(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        tick(3000);
        expect(app).toBeTruthy();
        fixture.destroy();
    }));
});
