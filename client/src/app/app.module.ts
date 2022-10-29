import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FeedScrollerComponent } from './feed-scroller/feed-scroller.component';
import { FeedContainerComponent } from './feed-container/feed-container.component';

@NgModule({
  declarations: [
    AppComponent,
    FeedScrollerComponent,
    FeedContainerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
