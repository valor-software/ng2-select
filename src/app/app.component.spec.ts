import {TestBed, async, fakeAsync, tick} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {ButtonsModule, TabsModule} from 'ngx-bootstrap';
import {AppComponent} from './app.component';
import {NgxSelectModule} from './lib';
import {SelectSectionComponent} from './demo/select-section';
import {SampleSectionComponent} from './demo/sample-section.component';
import {SingleDemoComponent} from './demo/select/single-demo';
import {RichDemoComponent} from './demo/select/rich-demo';
import {MultipleDemoComponent} from './demo/select/multiple-demo';
import {ChildrenDemoComponent} from './demo/select/children-demo';
import {NoAutoCompleteDemoComponent} from './demo/select/no-autocomplete-demo';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                FormsModule,
                ReactiveFormsModule,
                NgxSelectModule,
                TabsModule.forRoot(),
                ButtonsModule.forRoot(),
                CommonModule
            ],
            declarations: [
                AppComponent,
                SampleSectionComponent,
                SelectSectionComponent,
                ChildrenDemoComponent,
                MultipleDemoComponent,
                NoAutoCompleteDemoComponent,
                RichDemoComponent,
                SingleDemoComponent
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
