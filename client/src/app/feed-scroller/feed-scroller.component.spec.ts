import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedScrollerComponent } from './feed-scroller.component';

describe('FeedScrollerComponent', () => {
  let component: FeedScrollerComponent;
  let fixture: ComponentFixture<FeedScrollerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedScrollerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedScrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
