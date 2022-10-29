
import './FeedScroller.css';

import FeedContainer from '../feed_container/FeedContainer';



function FeedScroller(props) {
   function fetchReddit() {
       console.log("FETCH REDDIT");
       /*
      let parser = new RSSParser();

      parser.parseURL('https://www.reddit.com/.rss', (err: any, feed: any) => {
          if(err) {
              throw err;
          }

          console.log(feed.title);

          feed.items.forEach((entry: any) => {
              console.log(entry);

              console.log(entry.title + ': ' + entry.link);

              console.log(' ');
          });
      });
      */
    }



    return (
        <div id="root">
            <div>
                <button onClick={fetchReddit}>Reddit RSS</button>
            </div>

            <div className="domain_container">
                <div className="sidescroller">
                    <div className="feed_wrapper">
                        <FeedContainer></FeedContainer>
                    </div>

                    <div className="feed_wrapper">
                        <FeedContainer></FeedContainer>
                    </div>

                    <div className="feed_wrapper">
                        <FeedContainer></FeedContainer>
                    </div>

                    <div className="feed_wrapper">
                        <FeedContainer></FeedContainer>
                    </div>

                    <div className="feed_wrapper">
                        <FeedContainer></FeedContainer>
                    </div>

                    <div className="feed_wrapper">
                        <FeedContainer></FeedContainer>
                    </div>

                    <div className="feed_wrapper">
                        <FeedContainer></FeedContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeedScroller;
