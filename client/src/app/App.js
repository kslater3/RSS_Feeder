
import './App.css';

import FeedScroller from '../feed_scroller/FeedScroller';

//import { RSSParser } from 'rss-parser.min.js';


function App(props) {
   function addLink() {
       console.log("ADD LINK");
   }


   async function logout() {
       try {
           const response = await fetch('/logout', {
               method: 'POST',

               body: ''
           });

           if(!response.ok) {
               alert('Failed to Log Out, Something Went Wrong');
           }else {
               // Browser does not like to redirect after log in
               window.location.href = window.location.origin;
           }
       }catch(e) {
           console.error(e);
       }
   }



    return (
        <div id="root">
            <div id="header_container">
                <img
                    src="images/plus_icon.png"
                    alt="Img Failed to Load"
                    id="plus_icon"
                    onClick={addLink}
                />

                <div
                    id="logout_button"
                    onClick={logout}
                >
                    Logout
                </div>
            </div>

            <div id="content_container">
                <FeedScroller></FeedScroller>
            </div>
        </div>
    );
}

export default App;
