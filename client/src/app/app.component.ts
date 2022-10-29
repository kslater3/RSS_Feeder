import { Component } from '@angular/core';

import { FeedScrollerComponent } from './feed-scroller/feed-scroller.component';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    addLink() {
        console.log("ADD LINK");
    }


    async logout() {
        try {
            const response = await fetch('/logout', {
                method: 'POST',

                body: ''
            });

            if(!response.ok) {
                alert('Failed to Log Out, Something Went Wrong');
            }else {
                // Browser does not like to redirect after log in
                location.href = location.origin;
            }
        }catch(e) {
            console.error(e);
        }
    }
}
